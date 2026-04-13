import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDLORD)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('recent')
  async getRecentActivities(@Req() req) {
    return this.activitiesService.getRecentActivities(req.user.id);
  }
}
