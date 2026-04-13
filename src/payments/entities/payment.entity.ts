import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { User } from '../../users/entities/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  VERIFYING = 'verifying',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial',
  WAIVED = 'waived',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CHECK = 'check',
  CARD = 'card',
  ONLINE = 'online',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ type: 'uuid', name: 'lease_id' })
  leaseId: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'landlord_id' })
  landlordId: string;

  /** Full annual rent amount due for this period */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  /** Annual due date — typically the lease anniversary date */
  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'date', name: 'paid_date', nullable: true })
  paidDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'transaction_ref',
    nullable: true,
  })
  transactionRef?: string;

  @Column({ type: 'varchar', length: 50, name: 'transaction_document', nullable: true })
  transactionDocument?: string;

  /** The rental year this payment covers e.g. 2025 */
  @Column({ type: 'int', name: 'period_year' })
  periodYear: number;

  /**
   * Amount paid so far — useful when status is 'partial'.
   * Null means no payment received yet.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'amount_paid', nullable: true })
  amountPaid?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Lease, (lease) => lease.payments)
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;

  @ManyToOne(() => User, (user) => user.tenantPayments)
  @JoinColumn({ name: 'tenant_id' })
  tenant: User;

  @ManyToOne(() => User, (user) => user.landlordPayments)
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;

}
