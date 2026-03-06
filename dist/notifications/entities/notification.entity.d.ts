import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    COMPLAINT_SUBMITTED = "complaint_submitted",
    COMPLAINT_UPDATED = "complaint_updated",
    COMPLAINT_RESOLVED = "complaint_resolved",
    PAYMENT_DUE = "payment_due",
    PAYMENT_RECEIVED = "payment_received",
    PAYMENT_OVERDUE = "payment_overdue",
    LEASE_CREATED = "lease_created",
    LEASE_EXPIRING = "lease_expiring",
    LEASE_TERMINATED = "lease_terminated",
    DOCUMENT_UPLOADED = "document_uploaded",
    DOCUMENT_UPDATED = "document_updated",
    RENT_INCREASE = "rent_increase"
}
export declare enum NotificationChannel {
    IN_APP = "in_app",
    EMAIL = "email",
    BOTH = "both"
}
export declare class AppNotification extends BaseEntity {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    channel: NotificationChannel;
    isRead: boolean;
    referenceId: string;
    referenceType: string;
    sentAt: Date;
    readAt: Date;
    user: User;
}
