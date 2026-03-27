import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { Lease } from '../../lease/entities/lease.entity';

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ComplaintStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('complaints')
export class Complaint extends BaseEntity {
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'landlord_id' })
  landlordId: string;

  @Column({ type: 'uuid', name: 'property_id' })
  propertyId: string;

  @Column({ type: 'uuid', name: 'lease_id' })
  leaseId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ComplaintPriority, default: ComplaintPriority.MEDIUM })
  priority: ComplaintPriority;

  @Column({ type: 'enum', enum: ComplaintStatus, default: ComplaintStatus.OPEN })
  status: ComplaintStatus;

  @Column({ type: 'text', name: 'resolution_notes', nullable: true })
  resolutionNotes: string;

  @Column({ type: 'timestamp', name: 'resolved_at', nullable: true })
  resolvedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.submittedComplaints)
  @JoinColumn({ name: 'tenant_id' })
  tenant: User;

  @ManyToOne(() => User, (user) => user.receivedComplaints)
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;

  @ManyToOne(() => Property, (property) => property.complaints)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => Lease, (lease) => lease.complaints)
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;

}
