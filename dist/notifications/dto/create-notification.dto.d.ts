import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    title: string;
    message: string;
    type: NotificationType;
    read?: boolean;
    userId: string;
    referenceId?: string;
    referenceType?: string;
}
