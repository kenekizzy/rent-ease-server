import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lease } from '../lease/entities/lease.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Complaint } from '../complaints/entities/complaint.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Lease)
    private readonly leaseRepository: Repository<Lease>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async getRecentActivities(landlordId: string, limit = 10) {
    const [leases, payments, complaints] = await Promise.all([
      this.leaseRepository.find({
        where: { landlordId },
        relations: ['tenant', 'property'],
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.paymentRepository.find({
        where: { landlordId, status: PaymentStatus.PAID },
        relations: ['tenant', 'lease', 'lease.property'],
        order: { updatedAt: 'DESC' },
        take: limit,
      }),
      this.complaintRepository.find({
        where: { landlordId },
        relations: ['tenant', 'property'],
        order: { createdAt: 'DESC' },
        take: limit,
      }),
    ]);

    const activities = [
      ...leases.map((l) => ({
        type: 'tenant',
        title: 'New tenant assigned',
        desc: `${l.tenant ? l.tenant.firstName + ' ' + l.tenant.lastName : l.tenantEmail} moved into ${l.property?.name || 'Property'}`,
        time: l.createdAt,
        icon: 'tenant',
      })),
      ...payments.map((p) => ({
        type: 'payment',
        title: 'Payment received',
        desc: `${p.tenant?.firstName} ${p.tenant?.lastName} paid ₦${Number(p.amount).toLocaleString()} for ${p.lease?.property?.name || 'Property'}`,
        time: p.updatedAt,
        icon: 'payment',
      })),
      ...complaints.map((c) => ({
        type: 'complaint',
        title: 'Complaint submitted',
        desc: `${c.tenant ? c.tenant.firstName : 'Tenant'} reported ${c.title} in ${c.property?.name}`,
        time: c.createdAt,
        icon: 'complaint',
      })),
    ];

    // Sort by time descending and take the top N
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  }
}
