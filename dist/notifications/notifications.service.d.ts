import { Repository } from 'typeorm';
import { AppNotification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<AppNotification>);
    send(dto: CreateNotificationDto): Promise<AppNotification>;
    findAllForUser(userId: string): Promise<AppNotification[]>;
    markAsRead(id: string): Promise<void>;
}
