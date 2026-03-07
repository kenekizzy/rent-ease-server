import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyStatus } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from 'src/users/entities';
import { UserRole } from 'src/users/entities';

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
    if(!findUser){
      throw new NotFoundException('User not found');
    }

    if(findUser.role !== UserRole.LANDLORD){
      throw new ForbiddenException('You are not authorized to create this property');
    }
    const property = this.propertyRepository.create({ ...dto, landlordId });
    return this.propertyRepository.save(property);
  }

  async findAll(landlordId: string): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { landlordId },
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

  /** Summary stats for the landlord dashboard */
  async getOccupancySummary(landlordId: string) {
    const properties = await this.propertyRepository.find({ where: { landlordId } });
    const total = properties.length;
    const occupied = properties.filter((p) => p.status === PropertyStatus.OCCUPIED).length;
    const available = properties.filter((p) => p.status === PropertyStatus.AVAILABLE).length;
    const maintenance = properties.filter((p) => p.status === PropertyStatus.MAINTENANCE).length;

    return {
      total,
      occupied,
      available,
      maintenance,
      occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
    };
  }

  // ── Internal helpers used by other services ──────────────────────────────
  async findById(id: string): Promise<Property> {
    const p = await this.propertyRepository.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Property not found.');
    return p;
  }

  async setStatus(id: string, status: PropertyStatus): Promise<void> {
    await this.propertyRepository.update(id, { status });
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
