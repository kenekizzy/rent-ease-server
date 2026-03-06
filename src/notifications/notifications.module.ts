import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppNotification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationPreference } from './entities/notification-preferences.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AppNotification, NotificationPreference])],
    controllers: [],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
