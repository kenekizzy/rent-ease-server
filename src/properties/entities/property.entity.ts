import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { Complaint } from '../../complaints/entities/complaint.entity';
import { Document } from '../../files/entities/document.entity';
import { PropertyUnit } from './property-unit.entity';

import { PropertyType, PropertyStatus } from './property.enum';

@Entity('properties')
export class Property extends BaseEntity {

  @Column({ type: 'uuid', name: 'landlord_id' })
  landlordId: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  tenantId?: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, name: 'address_line1' })
  addressLine1: string;

  @Column({ type: 'varchar', length: 255, name: 'address_line2', nullable: true })
  addressLine2?: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 20, name: 'zip_code' })
  zipCode: string;

  @Column({ type: 'varchar', length: 100, default: 'Nigeria' })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'enum', enum: PropertyType, name: 'property_type' })
  propertyType: PropertyType;

  @Column({ nullable: true })
  condition?: 'new' | 'renovated' | 'old';

  @Column({ type: 'int', nullable: true })
  bedrooms?: number;

  @Column({ type: 'int', nullable: true })
  bathrooms?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'rent_amount', nullable: true })
  rentAmount?: number;

  @Column({ type: 'int', default: 12, name: 'rent_duration_in_months' })
  rentDurationInMonths: number;

  @Column({ type: 'jsonb', default: {} })
  additionalFees: {
    serviceCharge?: number;
    cautionFee?: number;
    agencyFee?: number;
    legalFee?: number;
  };

  @Column({ type: 'jsonb', default: {} })
  utilities: {
    electricity?: 'prepaid' | 'postpaid' | 'none';
    water?: 'borehole' | 'well' | 'none';
    wasteManagement?: boolean;
    security?: boolean;
  };

  @Column({ type: 'jsonb', default: [] })
  amenities: string[];

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({ type: 'boolean', default: false, name: 'is_listed' })
  isListed: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'published_at' })
  publishedAt?: Date;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;

  @OneToMany(() => PropertyUnit, (unit) => unit.property, { cascade: true })
  units: PropertyUnit[];

  @OneToMany(() => Lease, (lease) => lease.property)
  leases: Lease[];

  @OneToMany(() => Complaint, (complaint) => complaint.property)
  complaints: Complaint[];

  @OneToMany(() => Document, (doc) => doc.property)
  documents: Document[];
}