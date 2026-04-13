import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    findAll(@CurrentUser() user: User) {
        return this.notificationsService.findAllForUser(user.id);
    }

    @Patch('mark-all-read')
    markAllRead(@CurrentUser() user: User) {
        return this.notificationsService.markAllRead(user.id);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
        return this.notificationsService.markAsRead(id, user.id);
    }
}
