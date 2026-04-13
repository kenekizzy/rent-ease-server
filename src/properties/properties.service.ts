import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyStatus, PropertyType } from './entities/property.enum';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../users/entities';
import { UserRole } from '../users/entities';
import { LeaseStatus } from '../lease/entities/lease.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(landlordId: string, dto: CreatePropertyDto): Promise<Property> {
    const findUser = await this.userRepository.findOne({ where: { id: landlordId } });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    if (findUser.role !== UserRole.LANDLORD) {
      throw new ForbiddenException('You are not authorized to create this property');
    }
    const property = this.propertyRepository.create({ ...dto, landlordId });
    return this.propertyRepository.save(property);
  }

  async findAll(landlordId: string): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { landlordId },
      relations: ['units', 'leases', 'leases.tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, landlordId: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['leases', 'leases.tenant', 'complaints', 'documents'],
    });

    this.assertExists(property);
    this.assertOwner(property!, landlordId);
    return property!;
  }

  async update(id: string, landlordId: string, dto: UpdatePropertyDto): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    this.assertExists(property);
    this.assertOwner(property!, landlordId);

    Object.assign(property!, dto);
    return this.propertyRepository.save(property!);
  }

  async remove(id: string, landlordId: string): Promise<void> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    this.assertExists(property);
    this.assertOwner(property!, landlordId);
    await this.propertyRepository.remove(property!);
  }

  // ── Internal helpers used by other services ──────────────────────────────
  async findById(id: string, loadUnits = false): Promise<Property> {
    const p = await this.propertyRepository.findOne({
      where: { id },
      relations: loadUnits ? ['units'] : [],
    });
    if (!p) throw new NotFoundException('Property not found.');
    return p;
  }

  async getOccupancySummary(landlordId: string): Promise<any> {
    const properties = await this.propertyRepository.find({
      where: { landlordId },
      relations: ['leases', 'units'],
    });

    const summary = properties.map((property) => {
      const activeLeases = (property.leases ?? []).filter(
        (l) => l.status === LeaseStatus.ACTIVE,
      );

      let occupancyRate = 0;
      if (property.units?.length > 0) {
        occupancyRate = (activeLeases.length / property.units.length) * 100;
      } else {
        occupancyRate = activeLeases.length > 0 ? 100 : 0;
      }

      return {
        id: property.id,
        address: property.addressLine1,
        propertyType: property.propertyType,
        totalUnits: property.units?.length || 1,
        occupiedUnits: activeLeases.length,
        occupancyRate,
        status: property.status,
      };
    });

    return summary;
  }

  async recomputeStatus(propertyId: string): Promise<void> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['leases', 'units'],
    });
    if (!property) return;

    const activeLeases = (property.leases ?? []).filter(
      (l) => l.status === LeaseStatus.ACTIVE,
    );

    let newStatus: PropertyStatus;

    const unitTypes: PropertyType[] = [PropertyType.APARTMENT, PropertyType.STUDIO];
    if (unitTypes.includes(property.propertyType) && property.units?.length > 0) {
      const totalUnits = property.units.length;
      const occupiedUnits = activeLeases.length;
      if (occupiedUnits === 0) {
        newStatus = PropertyStatus.AVAILABLE;
      } else if (occupiedUnits >= totalUnits) {
        newStatus = PropertyStatus.OCCUPIED;
      } else {
        newStatus = PropertyStatus.PARTIALLY_OCCUPIED;
      }
    } else {
      // Single-occupancy property types
      newStatus = activeLeases.length > 0 ? PropertyStatus.OCCUPIED : PropertyStatus.AVAILABLE;
    }

    await this.propertyRepository.update(propertyId, { status: newStatus });
  }

  /** Explicit status override (e.g. MAINTENANCE) */
  async setStatus(id: string, status: PropertyStatus): Promise<void> {
    await this.propertyRepository.update(id, { status });
  }

  async findLeasedProperties(tenantId: string): Promise<Property[]> {
    return this.propertyRepository.createQueryBuilder('property')
      .innerJoin('property.leases', 'lease')
      .where('lease.tenantId = :tenantId', { tenantId })
      .andWhere('lease.status = :status', { status: LeaseStatus.ACTIVE })
      .getMany();
  }

  private assertExists(p: Property | null) {
    if (!p) throw new NotFoundException('Property not found.');
  }

  private assertOwner(p: Property, landlordId: string) {
    if (p.landlordId !== landlordId) {
      throw new ForbiddenException('You do not own this property.');
    }
  }
}
