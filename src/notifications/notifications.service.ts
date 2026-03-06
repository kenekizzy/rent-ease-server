import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPreference } from './entities/notification-preferences.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(AppNotification)
        private readonly notificationRepository: Repository<AppNotification>,
        @InjectRepository(NotificationPreference)
        private readonly preferenceRepository: Repository<NotificationPreference>,
    ) { }

    async send(dto: CreateNotificationDto): Promise<AppNotification | null> {
        // Find user preferences
        const prefs = await this.preferenceRepository.findOne({
            where: { userId: dto.userId },
        });

        // If no preference found, default to sending
        if (prefs) {
            // Check specific alert types
            if (this.isTypeDisabled(dto.type, prefs)) {
                return null;
            }

            // If in-app is disabled, don't store in DB (optional, but requested by logic)
            if (!prefs.inAppEnabled) {
                // Return null if NOT sending anywhere, but we might still want to email
            }
        }

        const notification = this.notificationRepository.create({
            ...dto,
            isRead: dto.read ?? false,
        });
        const saved = await this.notificationRepository.save(notification);

        // TODO: Email logic if prefs.emailEnabled is true using MailerModule

        return saved;
    }

    private isTypeDisabled(type: NotificationType, prefs: NotificationPreference): boolean {
        switch (type) {
            case NotificationType.COMPLAINT_SUBMITTED:
            case NotificationType.COMPLAINT_UPDATED:
            case NotificationType.COMPLAINT_RESOLVED:
                return !prefs.complaintAlerts;
            case NotificationType.PAYMENT_DUE:
            case NotificationType.PAYMENT_RECEIVED:
            case NotificationType.PAYMENT_OVERDUE:
                return !prefs.paymentAlerts;
            case NotificationType.RENT_INCREASE:
                return !prefs.rentReminders;
            case NotificationType.DOCUMENT_UPLOADED:
            case NotificationType.DOCUMENT_UPDATED:
                return !prefs.documentAlerts;
            default:
                return false;
        }
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
