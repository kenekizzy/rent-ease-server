import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Property } from '../../properties/entities/property.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { Complaint } from '../../properties/entities/complaint.entity';
import { AppNotification } from '../../notifications/entities/notification.entity';
import { NotificationPreference } from '../../notifications/entities/notification-preferences.entity';
import { Payment } from 'src/payments/entities';
import { Document } from 'src/files/entities';

export enum UserRole {
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}

@Entity('users')
export class User extends BaseEntity {

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 14, nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;



  // Relationships
  @OneToMany(() => Property, (property) => property.landlord)
  properties: Property[];

  @OneToMany(() => Lease, (lease) => lease.landlord)
  landlordLeases: Lease[];

  @OneToMany(() => Lease, (lease) => lease.tenant)
  tenantLeases: Lease[];

  @OneToMany(() => Payment, (payment) => payment.tenant)
  tenantPayments: Payment[];

  @OneToMany(() => Payment, (payment) => payment.landlord)
  landlordPayments: Payment[];

  @OneToMany(() => Complaint, (complaint) => complaint.tenant)
  submittedComplaints: Complaint[];

  @OneToMany(() => Complaint, (complaint) => complaint.landlord)
  receivedComplaints: Complaint[];

  @OneToMany(() => Document, (doc) => doc.uploadedBy)
  documents: Document[];

  @OneToMany(() => AppNotification, (notif) => notif.user)
  notifications: AppNotification[];

  @OneToOne(() => NotificationPreference, (pref) => pref.user)
  notificationPreference: NotificationPreference;
}
