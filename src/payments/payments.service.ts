import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Lease, LeaseStatus } from '../lease/entities/lease.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { SubmitProofDto } from './dto/submit-proof.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Lease)
        private readonly leaseRepository: Repository<Lease>,
        private readonly notificationsService: NotificationsService,
    ) { }

    /**
     * Generates yearly payments for all active leases that don't have a payment record for the current rental year.
     * This should be called by a cron job or manually by landlord.
     */
    async generateYearlyPayments() {
        const activeLeases = await this.leaseRepository.find({
            where: { status: LeaseStatus.ACTIVE },
            relations: ['property', 'tenant'],
        });

        const currentYear = new Date().getFullYear();
        const createdPayments: Payment[] = [];

        for (const lease of activeLeases) {
            // Check if payment already exists for this year
            const existing = await this.paymentRepository.findOne({
                where: { leaseId: lease.id, periodYear: currentYear },
            });

            if (!existing) {
                const payment = this.paymentRepository.create({
                    leaseId: lease.id,
                    tenantId: lease.tenantId,
                    landlordId: lease.landlordId,
                    amount: lease.annualRent,
                    dueDate: lease.annualDueDate,
                    periodYear: currentYear,
                    status: PaymentStatus.PENDING,
                    transactionDocument: '', // Initial empty string
                });

                const saved = await this.paymentRepository.save(payment);
                createdPayments.push(saved);

                // Notify tenant
                await this.notificationsService.send({
                    userId: lease.tenantId,
                    type: NotificationType.PAYMENT_DUE,
                    title: 'Annual Rent Due',
                    message: `Your annual rent of $${lease.annualRent} for ${lease.property.addressLine1} is due on ${lease.annualDueDate}.`,
                    referenceId: saved.id,
                    referenceType: 'payment',
                });
            }
        }

        return { generated: createdPayments.length };
    }

    async findAll(userId: string, role: 'landlord' | 'tenant'): Promise<Payment[]> {
        const where = role === 'landlord' ? { landlordId: userId } : { tenantId: userId };
        return this.paymentRepository.find({
            where,
            relations: ['lease', 'lease.property', 'tenant', 'landlord'],
            order: { dueDate: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['lease', 'lease.property', 'tenant', 'landlord'],
        });

        if (!payment) throw new NotFoundException('Payment record not found.');
        if (payment.tenantId !== userId && payment.landlordId !== userId) {
            throw new ForbiddenException('Access denied.');
        }

        return payment;
    }

    async submitTenantProof(id: string, tenantId: string, dto: SubmitProofDto): Promise<Payment> {
        const payment = await this.findOne(id, tenantId);

        if (payment.tenantId !== tenantId) {
            throw new ForbiddenException('You can only submit proof for your own payments.');
        }

        if (payment.status === PaymentStatus.PAID) {
            throw new BadRequestException('This payment has already been marked as paid.');
        }

        payment.status = PaymentStatus.VERIFYING;
        payment.paidDate = new Date(dto.paidDate);
        payment.paymentMethod = dto.paymentMethod;
        payment.transactionRef = dto.transactionRef;
        if (dto.transactionDocument) {
            payment.transactionDocument = dto.transactionDocument;
        }
        payment.notes = dto.notes;

        const updated = await this.paymentRepository.save(payment);

        // Notify landlord
        await this.notificationsService.send({
            userId: payment.landlordId,
            type: NotificationType.PAYMENT_RECEIVED,
            title: 'Payment Proof Submitted',
            message: `A tenant has submitted payment proof for ${payment.lease.property.addressLine1}. Please verify.`,
            referenceId: id,
            referenceType: 'payment',
        });

        return updated;
    }

    async recordPayment(id: string, landlordId: string, dto: RecordPaymentDto): Promise<Payment> {
        const payment = await this.findOne(id, landlordId);

        if (payment.landlordId !== landlordId) {
            throw new ForbiddenException('Only the landlord can record a payment.');
        }

        payment.status = PaymentStatus.PAID;
        payment.paidDate = dto.paidDate ? new Date(dto.paidDate) : new Date();
        payment.paymentMethod = dto.paymentMethod;
        payment.transactionRef = dto.transactionRef;
        payment.amountPaid = dto.amountPaid ?? Number(payment.amount);
        payment.notes = dto.notes;

        const updated = await this.paymentRepository.save(payment);

        // Notify tenant
        await this.notificationsService.send({
            userId: payment.tenantId,
            type: NotificationType.PAYMENT_RECEIVED,
            title: 'Payment Received & Verified',
            message: `We have received and verified your payment of ₦${Number(payment.amountPaid).toLocaleString()} for the period ${payment.periodYear}.`,
            referenceId: id,
            referenceType: 'payment',
        });

        return updated;
    }

    async getFinancialReport(landlordId: string, year: number) {
        const payments = await this.paymentRepository.find({
            where: {
                landlordId,
                periodYear: year,
                status: PaymentStatus.PAID,
            },
            relations: ['lease', 'lease.property'],
        });

        const report = {
            year,
            totalRevenue: 0,
            propertyBreakdown: {},
            monthlyBreakdown: new Array(12).fill(0) as number[],
        };

        payments.forEach(p => {
            const propertyId = p.lease.propertyId;
            const propertyName = p.lease.property.addressLine1;
            const amount = Number(p.amountPaid);

            report.totalRevenue += amount;

            if (!report.propertyBreakdown[propertyId]) {
                report.propertyBreakdown[propertyId] = {
                    name: propertyName,
                    total: 0,
                };
            }
            report.propertyBreakdown[propertyId].total += amount;

            if (p.paidDate) {
                report.monthlyBreakdown[p.paidDate.getMonth()] += amount;
            }
        });

        return report;
    }
}
