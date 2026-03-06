import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Check } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Document } from '../../files/entities/document.entity';

export enum LeaseStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

@Entity('leases')
@Check(`"end_date" > "start_date"`)
export class Lease extends BaseEntity {
  @Column({ type: 'uuid', name: 'property_id' })
  propertyId: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'landlord_id' })
  landlordId: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  /** Full yearly rent amount */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'annual_rent' })
  annualRent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'security_deposit' })
  securityDeposit: number;

  /**
   * The calendar date each year when rent is due.
   * Defaults to the lease start_date (anniversary billing).
   */
  @Column({ type: 'date', name: 'annual_due_date' })
  annualDueDate: Date;

  @Column({
    type: 'enum',
    enum: LeaseStatus,
    default: LeaseStatus.ACTIVE,
  })
  status: LeaseStatus;

  @Column({ type: 'text', name: 'terms_text', nullable: true })
  termsText: string;

  // Relations
  @ManyToOne(() => Property, (property) => property.leases)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => User, (user) => user.tenantLeases)
  @JoinColumn({ name: 'tenant_id' })
  tenant: User;

  @ManyToOne(() => User, (user) => user.landlordLeases)
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;

  @OneToMany(() => Payment, (payment) => payment.lease)
  payments: Payment[];

  @OneToMany(() => Complaint, (complaint) => complaint.lease)
  complaints: Complaint[];

  @OneToMany(() => Document, (doc) => doc.lease)
  documents: Document[];
}
