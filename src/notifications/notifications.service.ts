import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(AppNotification)
        private readonly notificationRepository: Repository<AppNotification>,
    ) { }

    async send(dto: CreateNotificationDto): Promise<AppNotification> {
        const notification = this.notificationRepository.create({
            ...dto,
            isRead: dto.read ?? false,
        });
        return this.notificationRepository.save(notification);
    }

    async findAllForUser(userId: string) {
        return this.notificationRepository.find({
            where: { userId },
            order: { sentAt: 'DESC' },
        });
    }

    async markAsRead(id: string) {
        await this.notificationRepository.update(id, { isRead: true, readAt: new Date() });
    }
}
