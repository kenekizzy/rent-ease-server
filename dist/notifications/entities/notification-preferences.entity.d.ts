import { User } from '../../users/entities/user.entity';
export declare class NotificationPreference {
    id: string;
    userId: string;
    emailEnabled: boolean;
    inAppEnabled: boolean;
    complaintAlerts: boolean;
    paymentAlerts: boolean;
    rentReminders: boolean;
    documentAlerts: boolean;
    reminderDaysBefore: number;
    updatedAt: Date;
    user: User;
}
