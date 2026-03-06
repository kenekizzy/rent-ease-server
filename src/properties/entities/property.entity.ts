import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { Complaint } from './complaint.entity';
import { Document } from '../../files/entities/document.entity';

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  CONDO = 'condo',
  STUDIO = 'studio',
  TOWNHOUSE = 'townhouse',
  COMMERCIAL = 'commercial',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

@Entity('properties')
export class Property extends BaseEntity {
  @Column({ type: 'uuid', name: 'landlord_id' })
  landlordId: string;

  @Column({ type: 'varchar', length: 255, name: 'address_line1' })
  addressLine1: string;

  @Column({ type: 'varchar', length: 255, name: 'address_line2', nullable: true })
  addressLine2: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  state: string;

  @Column({ type: 'varchar', length: 20, name: 'zip_code' })
  zipCode: string;

  @Column({ type: 'enum', enum: PropertyType, name: 'property_type' })
  propertyType: PropertyType;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'rent_amount' })
  rentAmount: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({ type: 'int', nullable: true })
  bedrooms: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  bathrooms: number;

  // Relations
  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;

  @OneToMany(() => Lease, (lease) => lease.property)
  leases: Lease[];

  @OneToMany(() => Complaint, (complaint) => complaint.property)
  complaints: Complaint[];

  @OneToMany(() => Document, (doc) => doc.property)
  documents: Document[];
}
