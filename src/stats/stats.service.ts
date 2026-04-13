import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Lease, LeaseStatus } from '../lease/entities/lease.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Complaint, ComplaintStatus } from '../complaints/entities/complaint.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Lease)
    private readonly leaseRepository: Repository<Lease>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async getLandlordSummary(landlordId: string) {
    const properties = await this.propertyRepository.find({
      where: { landlordId },
      relations: ['units', 'leases'],
    });

    const activeLeases = await this.leaseRepository.find({
      where: { landlordId, status: LeaseStatus.ACTIVE },
    });

    const pendingPayments = await this.paymentRepository.find({
      where: { landlordId, status: PaymentStatus.PENDING },
    });

    const totalProperties = properties.length;
    let totalUnits = 0;
    let occupiedUnits = 0;
    let monthlyIncome = 0;

    properties.forEach((p) => {
      if (p.units && p.units.length > 0) {
        totalUnits += p.units.length;
      } else {
        totalUnits += 1; 
      }
    });

    activeLeases.forEach((l) => {
      occupiedUnits += 1;
      monthlyIncome += Number(l.annualRent) / 12;
    });

    const outstandingAmount = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    const lastMonthIncome = monthlyIncome * 0.95; 
    const incomeGrowth = lastMonthIncome > 0 ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;

    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      occupancyRate: Math.round(occupancyRate),
      monthlyIncome: Math.round(monthlyIncome),
      incomeGrowth: Math.round(incomeGrowth),
      outstandingPayments: pendingPayments.length,
      outstandingAmount: Math.round(outstandingAmount),
    };
  }

  async getTenantSummary(tenantId: string) {
    const activeLease = await this.leaseRepository.findOne({
      where: { tenantId, status: LeaseStatus.ACTIVE },
      relations: ['property', 'landlord', 'unit'],
    });

    const payments = await this.paymentRepository.find({
      where: { tenantId },
    });

    const openComplaints = await this.complaintRepository.count({
      where: { tenantId, status: ComplaintStatus.OPEN },
    });

    const totalPaid = payments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingAmount = payments
      .filter((p) => p.status === PaymentStatus.PENDING)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      activeLease,
      stats: {
        totalPaid,
        pendingAmount,
        openComplaints,
        nextDueDate: activeLease?.annualDueDate || null,
        monthlyRent: activeLease ? Math.round(Number(activeLease.annualRent) / 12) : 0,
      },
    };
  }
}
