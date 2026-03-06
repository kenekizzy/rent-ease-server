import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lease, LeaseStatus } from './entities/lease.entity';
import { PropertyStatus } from 'src/properties/entities/property.entity';
import { CreateLeaseDto, UpdateLeaseDto, TerminateLeaseDto } from './dto/lease.dto';
import { UsersService } from 'src/users/users.service';
import { PropertiesService } from 'src/properties/properties.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class LeaseService {
  constructor(
    @InjectRepository(Lease)
    private readonly leaseRepository: Repository<Lease>,
    private readonly usersService: UsersService,
    private readonly propertiesService: PropertiesService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(landlordId: string, dto: CreateLeaseDto): Promise<Lease> {
    const property = await this.propertiesService.findById(dto.propertyId);

    if (property.landlordId !== landlordId) {
      throw new ForbiddenException('You do not own this property.');
    }
    if (property.status === PropertyStatus.OCCUPIED) {
      throw new BadRequestException('Property is already occupied.');
    }

    const lease = this.leaseRepository.create({
      ...dto,
      landlordId,
      annualDueDate: dto.annualDueDate ?? dto.startDate,
    });

    const saved = await this.leaseRepository.save(lease);

    // Mark property as occupied
    await this.propertiesService.setStatus(dto.propertyId, PropertyStatus.OCCUPIED);

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
      relations: ['property', 'landlord'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: { id },
      relations: ['tenant', 'landlord', 'property', 'paymentRecords', 'documents'],
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

    // Free up the property
    await this.propertiesService.setStatus(lease!.propertyId, PropertyStatus.AVAILABLE);

    // Notify tenant
    await this.notificationsService.send({
      userId: lease!.tenantId,
      type: NotificationType.LEASE_TERMINATED,
      title: 'Lease Terminated',
      message: `Your lease has been terminated. Reason: ${dto.reason}`,
      referenceId: id,
      referenceType: 'lease',
    });

    return updated;
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
