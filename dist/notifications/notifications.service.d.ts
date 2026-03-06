import { Repository } from 'typeorm';
import { AppNotification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPreference } from './entities/notification-preferences.entity';
export declare class NotificationsService {
    private readonly notificationRepository;
    private readonly preferenceRepository;
    constructor(notificationRepository: Repository<AppNotification>, preferenceRepository: Repository<NotificationPreference>);
    send(dto: CreateNotificationDto): Promise<AppNotification | null>;
    private isTypeDisabled;
    findAllForUser(userId: string): Promise<AppNotification[]>;
    markAsRead(id: string): Promise<void>;
}
