import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('landlord-summary')
  @Roles(UserRole.LANDLORD)
  async getLandlordSummary(@Req() req) {
    return this.statsService.getLandlordSummary(req.user.id);
  }

  @Get('tenant-summary')
  @Roles(UserRole.TENANT)
  async getTenantSummary(@Req() req) {
    return this.statsService.getTenantSummary(req.user.id);
  }
}
