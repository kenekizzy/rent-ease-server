import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { SubmitProofDto } from './dto/submit-proof.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('generate')
    @Roles(UserRole.LANDLORD)
    generatePayments() {
        return this.paymentsService.generateYearlyPayments();
    }

    @Get()
    findAll(@Request() req) {
        return this.paymentsService.findAll(req.user.id, req.user.role);
    }

    @Get('report')
    @Roles(UserRole.LANDLORD)
    getReport(@Request() req, @Query('year', ParseIntPipe) year: number) {
        return this.paymentsService.getFinancialReport(req.user.id, year);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.paymentsService.findOne(id, req.user.id);
    }

    @Patch(':id/record')
    @Roles(UserRole.LANDLORD)
    recordPayment(@Param('id') id: string, @Request() req, @Body() dto: RecordPaymentDto) {
        return this.paymentsService.recordPayment(id, req.user.id, dto);
    }

    @Patch(':id/submit-proof')
    @Roles(UserRole.TENANT)
    submitProof(@Param('id') id: string, @Request() req, @Body() dto: SubmitProofDto) {
        return this.paymentsService.submitTenantProof(id, req.user.id, dto);
    }
}
