import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPreference } from './entities/notification-preferences.entity';
import { UsersService } from '../users/users.service';
import { EmailService } from '../mailer/mailer.service';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectRepository(AppNotification)
        private readonly notificationRepository: Repository<AppNotification>,
        @InjectRepository(NotificationPreference)
        private readonly preferenceRepository: Repository<NotificationPreference>,
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
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

        if (prefs?.emailEnabled) {
            try {
                const user = await this.usersService.findOne(dto.userId);
                await this.emailService.sendEmail({
                    to: user.email,
                    subject: dto.title,
                    text: dto.message,
                });
            } catch (err) {
                this.logger.error('Failed to send notification email', err);
            }
        }

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

    async markAsRead(id: string, userId: string): Promise<AppNotification> {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new NotFoundException(`Notification ${id} not found`);
        }
        if (notification.userId !== userId) {
            throw new ForbiddenException('You do not have permission to mark this notification as read');
        }
        await this.notificationRepository.update(id, { isRead: true, readAt: new Date() });
        return { ...notification, isRead: true, readAt: new Date() };
    }

    async markAllRead(userId: string): Promise<{ updated: number }> {
        const result = await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() },
        );
        return { updated: result.affected ?? 0 };
    }
}
