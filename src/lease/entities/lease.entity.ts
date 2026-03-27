import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Check } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Complaint } from '../../complaints/entities/complaint.entity';
import { Document } from '../../files/entities/document.entity';

export enum LeaseStatus {
  PENDING_ACCEPTANCE = 'pending_acceptance',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

@Entity('leases')
@Check(`"end_date" > "start_date"`)
export class Lease extends BaseEntity {
  @Column({ type: 'uuid', name: 'property_id' })
  propertyId: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  tenantId: string;

  @Column({ type: 'varchar', length: 255, name: 'tenant_email', nullable: true })
  tenantEmail: string;

  @Column({ type: 'varchar', length: 255, name: 'invite_token', nullable: true })
  inviteToken: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  unit: string;

  @Column({ type: 'uuid', name: 'landlord_id' })
  landlordId: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'annual_rent' })
  annualRent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'security_deposit' })
  securityDeposit: number;

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
