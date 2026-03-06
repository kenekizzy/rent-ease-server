import { BaseEntity } from '../../common/entities/base.entity';
import { Property } from '../../properties/entities/property.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { AppNotification } from '../../notifications/entities/notification.entity';
import { NotificationPreference } from '../../notifications/entities/notification-preferences.entity';
import { Payment } from 'src/payments/entities';
import { Document } from 'src/files/entities';
export declare enum UserRole {
    LANDLORD = "landlord",
    TENANT = "tenant"
}
export declare class User extends BaseEntity {
    email: string;
    password: string;
    avatar: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    phone: string;
    role: UserRole;
    isActive: boolean;
    properties: Property[];
    landlordLeases: Lease[];
    tenantLeases: Lease[];
    tenantPayments: Payment[];
    landlordPayments: Payment[];
    submittedComplaints: Complaint[];
    receivedComplaints: Complaint[];
    documents: Document[];
    notifications: AppNotification[];
    notificationPreference: NotificationPreference;
}
