import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lease, LeaseStatus } from './entities/lease.entity';
import { PropertyStatus, PropertyType } from '../properties/entities/property.enum';
import { CreateLeaseDto, UpdateLeaseDto, TerminateLeaseDto, InviteLeaseDto, AcceptInviteDto } from './dto/lease.dto';
import { UsersService } from '../users/users.service';
import { PropertiesService } from '../properties/properties.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { EmailService } from '../mailer/mailer.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LeaseService {
  constructor(
    @InjectRepository(Lease)
    private readonly leaseRepository: Repository<Lease>,
    private readonly usersService: UsersService,
    private readonly propertiesService: PropertiesService,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) { }

  async create(landlordId: string, dto: CreateLeaseDto): Promise<Lease> {
    const property = await this.propertiesService.findById(dto.propertyId, true);

    if(!property){
      throw new NotFoundException('Property not found.');
    }

    const tenant = await this.usersService.findOne(dto.tenantId);

    if(!tenant){
      throw new NotFoundException('Tenant not found.');
    }

    if (property.landlordId !== landlordId) {
      throw new ForbiddenException('You do not own this property.');
    }
    const unitTypes = [PropertyType.APARTMENT, PropertyType.STUDIO];
    const isUnitBased = unitTypes.includes(property.propertyType) && property.units?.length > 0;

    if (isUnitBased && !dto.unitId) {
      throw new BadRequestException('This property has multiple units. Please select a unit.');
    }
    const unit = isUnitBased ? property.units.find(u => u.id === dto.unitId) : null;
    if (isUnitBased && !unit) {
      throw new BadRequestException('Selected unit not found in this property.');
    }

    if (!isUnitBased && property.status === PropertyStatus.OCCUPIED) {
      throw new BadRequestException('Property is already occupied.');
    }

    if(property.propertyType === PropertyType.HOUSE && (property.status === PropertyStatus.OCCUPIED || property.status === PropertyStatus.PARTIALLY_OCCUPIED)){
      throw new BadRequestException('Property is already occupied.');
    }

    if((property.propertyType === PropertyType.APARTMENT || property.propertyType === PropertyType.STUDIO) && property.status === PropertyStatus.OCCUPIED){
      throw new BadRequestException('Property is already occupied.');
    }

    if((property.propertyType === PropertyType.APARTMENT || property.propertyType === PropertyType.STUDIO) && !dto.unitId && dto.annualRent){
      throw new BadRequestException('Please select a unit.');
    }

    const existingLease = await this.leaseRepository.findOne({
      where: { propertyId: dto.propertyId, tenantId: dto.tenantId, status: LeaseStatus.ACTIVE },
    });

    if(existingLease){
      throw new BadRequestException('Tenant already has an active lease in this property.');
    }

    let expectedRent = property.rentAmount;
    if (isUnitBased && dto.unitId) {
      const unitData = property.units.find((u) => u.id === dto.unitId);
      if (!unitData) {
        throw new BadRequestException(`Unit with ID "${dto.unitId}" does not exist in this property.`);
      }

      const existingUnitLease = await this.leaseRepository.findOne({
        where: { unitId: dto.unitId, status: LeaseStatus.ACTIVE },
      });
      if (existingUnitLease) {
        throw new BadRequestException(`Unit "${unitData.name}" is already occupied.`);
      }

      if (unitData.rentAmount !== undefined) {
        expectedRent = Math.trunc(unitData.rentAmount);
      }
    }

    if (expectedRent !== undefined && expectedRent !== dto.annualRent) {
      throw new BadRequestException(`Rent amount does not match expected rent amount (₦${expectedRent}).`);
    }

    const lease = this.leaseRepository.create({
      ...dto,
      landlordId,
      annualDueDate: dto.annualDueDate ?? dto.startDate,
    });

    const saved = await this.leaseRepository.save(lease);

    // Recompute property status
    await this.propertiesService.recomputeStatus(dto.propertyId);

    // Notify tenant
    await this.notificationsService.send({
      userId: dto.tenantId,
      type: NotificationType.LEASE_CREATED,
      title: 'New Lease Agreement',
      message: `A lease has been created for your tenancy at ${property.addressLine1}.`,
      referenceId: saved.id,
      referenceType: 'lease',
    });

    return saved;
  }

  async inviteTenant(landlordId: string, dto: InviteLeaseDto): Promise<Lease> {
    const property = await this.propertiesService.findById(dto.propertyId, true);

    if (property.landlordId !== landlordId) {
      throw new ForbiddenException('You do not own this property.');
    }

    const unitTypes = [PropertyType.APARTMENT, PropertyType.STUDIO];
    const isUnitBased = unitTypes.includes(property.propertyType) && property.units?.length > 0;

    if (isUnitBased && !dto.unitId) {
      throw new BadRequestException('This property has multiple units. Please select a unit.');
    }

    if (!isUnitBased && property.status === PropertyStatus.OCCUPIED) {
      throw new BadRequestException('Property is already occupied.');
    }

    // For unit-based properties, validate the unit exists and is empty
    if (isUnitBased && dto.unitId) {
      const unit = property.units.find((u) => u.id === dto.unitId);
      if (!unit) {
        throw new BadRequestException(`Unit with ID "${dto.unitId}" does not exist in this property.`);
      }
      // Check if unit is already occupied
      const existingUnitLease = await this.leaseRepository.findOne({
        where: { unitId: dto.unitId, status: LeaseStatus.ACTIVE },
      });
      if (existingUnitLease) {
        throw new BadRequestException(`Unit "${unit.name}" is already occupied.`);
      }
    }

    const inviteToken = uuid();

    const lease = this.leaseRepository.create({
      propertyId: dto.propertyId,
      tenantEmail: dto.tenantEmail,
      unitId: dto.unitId,
      landlordId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      annualRent: dto.annualRent,
      securityDeposit: dto.securityDeposit,
      annualDueDate: dto.annualDueDate ? new Date(dto.annualDueDate) : new Date(dto.startDate),
      termsText: dto.termsText,
      inviteToken,
      status: LeaseStatus.PENDING_ACCEPTANCE,
    });

    const saved = await this.leaseRepository.save(lease);

    // Send invitation email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${frontendUrl}/accept-invite?token=${inviteToken}`;

    try {
     this.emailService.sendInviteEmail(dto.tenantEmail, inviteLink);
    } catch (err) {
      console.error('Invite email failed to send:', err);
    }

    return saved;
  }

  async acceptInvite(tenantId: string, dto: AcceptInviteDto): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: { inviteToken: dto.token, status: LeaseStatus.PENDING_ACCEPTANCE },
      relations: ['property'],
    });

    if (!lease) {
      throw new NotFoundException('Invalid or expired invite token.');
    }

    // Bind the tenant to this lease
    lease.tenantId = tenantId;
    lease.status = LeaseStatus.ACTIVE;
    lease.inviteToken = undefined as unknown as string; // consume the token

    const saved = await this.leaseRepository.save(lease);

    // Recompute property occupancy
    await this.propertiesService.recomputeStatus(lease.propertyId);

    return saved;
  }

  async findAllForLandlord(landlordId: string): Promise<Lease[]> {
    return this.leaseRepository.find({
      where: { landlordId },
      relations: ['tenant', 'property'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForTenant(tenantId: string): Promise<Lease[]> {
    return this.leaseRepository.find({
      where: { tenantId },
      relations: ['property', 'landlord', 'unit'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: { id },
      relations: ['tenant', 'landlord', 'property', 'unit', 'payments', 'documents'],
    });

    this.assertExists(lease);
    this.assertParticipant(lease!, userId);
    return lease!;
  }

  async update(id: string, landlordId: string, dto: UpdateLeaseDto): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({ where: { id } });
    this.assertExists(lease);

    if (lease!.landlordId !== landlordId) {
      throw new ForbiddenException('Only the landlord can modify this lease.');
    }

    const previousRent = lease!.annualRent;
    Object.assign(lease!, dto);
    const updated = await this.leaseRepository.save(lease!);

    // Notify tenant if rent changed
    if (dto.annualRent && dto.annualRent !== previousRent) {
      await this.notificationsService.send({
        userId: lease!.tenantId,
        type: NotificationType.RENT_INCREASE,
        title: 'Rent Update',
        message: `Your annual rent has been updated from $${previousRent} to $${dto.annualRent}.`,
        referenceId: id,
        referenceType: 'lease',
      });
    }

    return updated;
  }

  async terminate(id: string, landlordId: string, dto: TerminateLeaseDto): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    this.assertExists(lease);

    if (lease!.landlordId !== landlordId) {
      throw new ForbiddenException('Only the landlord can terminate this lease.');
    }
    if (lease!.status !== LeaseStatus.ACTIVE) {
      throw new BadRequestException('Only active leases can be terminated.');
    }

    lease!.status = LeaseStatus.TERMINATED;
    lease!.endDate = new Date();
    const updated = await this.leaseRepository.save(lease!);

    // Recompute property status
    await this.propertiesService.recomputeStatus(lease!.propertyId);

    // Notify tenant
    if (lease!.tenantId) {
      await this.notificationsService.send({
        userId: lease!.tenantId,
        type: NotificationType.LEASE_TERMINATED,
        title: 'Lease Terminated',
        message: `Your lease has been terminated. Reason: ${dto.reason}`,
        referenceId: id,
        referenceType: 'lease',
      });
    }

    return updated;
  }

  /** Look up a lease by an invite token — used by the frontend accept-invite page */
  async findByInviteToken(token: string): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: { inviteToken: token },
      relations: ['property', 'unit'],
    });
    if (!lease) throw new NotFoundException('Invalid or expired invite token.');
    return lease;
  }

  async findPendingInvitationsByEmail(email: string): Promise<Lease[]> {
    return this.leaseRepository.find({
      where: { 
        tenantEmail: email, 
        status: LeaseStatus.PENDING_ACCEPTANCE 
      },
      relations: ['property', 'unit', 'landlord'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Internal ──────────────────────────────────────────────────────────────
  async findById(id: string): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({ where: { id } });
    if (!lease) throw new NotFoundException('Lease not found.');
    return lease;
  }

  private assertExists(l: Lease | null) {
    if (!l) throw new NotFoundException('Lease not found.');
  }

  private assertParticipant(l: Lease, userId: string) {
    if (l.landlordId !== userId && l.tenantId !== userId) {
      throw new ForbiddenException('You are not a participant of this lease.');
    }
  }
}
