import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'boolean', name: 'email_enabled', default: true })
  emailEnabled: boolean;

  @Column({ type: 'boolean', name: 'in_app_enabled', default: true })
  inAppEnabled: boolean;

  @Column({ type: 'boolean', name: 'complaint_alerts', default: true })
  complaintAlerts: boolean;

  @Column({ type: 'boolean', name: 'payment_alerts', default: true })
  paymentAlerts: boolean;

  @Column({ type: 'boolean', name: 'rent_reminders', default: true })
  rentReminders: boolean;

  @Column({ type: 'boolean', name: 'document_alerts', default: true })
  documentAlerts: boolean;

  @Column({ type: 'int', name: 'reminder_days_before', default: 3 })
  reminderDaysBefore: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.notificationPreference)
  @JoinColumn({ name: 'user_id' })
  user: User;
}