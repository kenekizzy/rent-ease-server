import {
  Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, HttpCode, HttpStatus
} from '@nestjs/common';
import { LeaseService } from './lease.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLeaseDto, UpdateLeaseDto, TerminateLeaseDto, InviteLeaseDto, AcceptInviteDto } from './dto/lease.dto';

@UseGuards(JwtAuthGuard)
@Controller('leases')
export class LeaseController {
  constructor(private readonly leaseService: LeaseService) { }

  @Post()
  create(@Request() req: any, @Body() dto: CreateLeaseDto) {
    return this.leaseService.create(req.user.id, dto);
  }

  @Post('invite')
  inviteTenant(@Request() req: any, @Body() dto: InviteLeaseDto) {
    return this.leaseService.inviteTenant(req.user.id, dto);
  }

  /** Tenant: accept a pending invitation by token */
  @Post('accept-invite')
  @HttpCode(HttpStatus.OK)
  acceptInvite(@Request() req: any, @Body() dto: AcceptInviteDto) {
    return this.leaseService.acceptInvite(req.user.id, dto);
  }

  /** Get lease details for the accept-invite page (public-ish, checked by token) */
  @Get('invite/:token')
  getByToken(@Param('token') token: string) {
    return this.leaseService.findByInviteToken(token);
  }

  /** Landlord: list all leases they own */
  @Get('landlord')
  findAllForLandlord(@Request() req: any) {
    return this.leaseService.findAllForLandlord(req.user.id);
  }

  /** Tenant: list all leases they are part of */
  @Get('tenant')
  findAllForTenant(@Request() req: any) {
    return this.leaseService.findAllForTenant(req.user.id);
  }

  /** Single lease by ID */
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.leaseService.findOne(id, req.user.id);
  }

  /** Update a lease */
  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateLeaseDto) {
    return this.leaseService.update(id, req.user.id, dto);
  }

  /** Terminate a lease */
  @Post(':id/terminate')
  terminate(@Request() req: any, @Param('id') id: string, @Body() dto: TerminateLeaseDto) {
    return this.leaseService.terminate(id, req.user.id, dto);
  }
}
