import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  COMPLAINT_SUBMITTED = 'complaint_submitted',
  COMPLAINT_UPDATED = 'complaint_updated',
  COMPLAINT_RESOLVED = 'complaint_resolved',
  PAYMENT_DUE = 'payment_due',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_OVERDUE = 'payment_overdue',
  LEASE_CREATED = 'lease_created',
  LEASE_EXPIRING = 'lease_expiring',
  LEASE_TERMINATED = 'lease_terminated',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_UPDATED = 'document_updated',
  RENT_INCREASE = 'rent_increase',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  BOTH = 'both',
}

@Entity('notifications')
export class AppNotification extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead: boolean;

  /**
   * Polymorphic reference — stores the UUID of the related entity
   * (complaint, payment, lease, document) without a hard FK constraint.
   */
  @Column({ type: 'uuid', name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ type: 'varchar', length: 50, name: 'reference_type', nullable: true })
  referenceType: string;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  @Column({ type: 'timestamp', name: 'read_at', nullable: true })
  readAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
