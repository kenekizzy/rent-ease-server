import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from './entities/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Lease, LeaseStatus } from '../lease/entities/lease.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class ComplaintsService {
    constructor(
        @InjectRepository(Complaint)
        private readonly complaintRepository: Repository<Complaint>,
        @InjectRepository(Lease)
        private readonly leaseRepository: Repository<Lease>,
        private readonly notificationsService: NotificationsService,
    ) { }

    async create(tenantId: string, dto: CreateComplaintDto): Promise<Complaint> {
        // Find active lease for this tenant and property
        const lease = await this.leaseRepository.findOne({
            where: {
                tenantId,
                propertyId: dto.propertyId,
                status: LeaseStatus.ACTIVE,
            },
            relations: ['property'],
        });

        if (!lease) {
            throw new BadRequestException('No active lease found for this property.');
        }

        const complaint = this.complaintRepository.create({
            ...dto,
            tenantId,
            landlordId: lease.landlordId,
            leaseId: lease.id,
        });

        const saved = await this.complaintRepository.save(complaint);

        // Notify landlord
        await this.notificationsService.send({
            userId: lease.landlordId,
            type: NotificationType.COMPLAINT_SUBMITTED,
            title: 'New Complaint Submitted',
            message: `A new complaint has been submitted for ${lease.property.addressLine1}: ${dto.title}`,
            referenceId: saved.id,
            referenceType: 'complaint',
        });

        return saved;
    }

    async findAll(userId: string, role: 'landlord' | 'tenant'): Promise<Complaint[]> {
        const where = role === 'landlord' ? { landlordId: userId } : { tenantId: userId };
        return this.complaintRepository.find({
            where,
            relations: ['property', 'tenant', 'lease'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Complaint> {
        const complaint = await this.complaintRepository.findOne({
            where: { id },
            relations: ['property', 'tenant', 'landlord', 'lease'],
        });

        if (!complaint) throw new NotFoundException('Complaint not found.');
        if (complaint.tenantId !== userId && complaint.landlordId !== userId) {
            throw new ForbiddenException('Access denied.');
        }

        return complaint;
    }

    async update(id: string, userId: string, dto: UpdateComplaintDto): Promise<Complaint> {
        const complaint = await this.findOne(id, userId);

        // Only landlord can update status to in_progress/resolved
        if (dto.status && complaint.landlordId !== userId) {
            throw new ForbiddenException('Only the landlord can update complaint status.');
        }

        const previousStatus = complaint.status;
        Object.assign(complaint, dto);

        if (dto.status === ComplaintStatus.RESOLVED && previousStatus !== ComplaintStatus.RESOLVED) {
            complaint.resolvedAt = new Date();
        }

        const updated = await this.complaintRepository.save(complaint);

        // Notify tenant if status changed
        if (dto.status && dto.status !== previousStatus) {
            await this.notificationsService.send({
                userId: complaint.tenantId,
                type: NotificationType.COMPLAINT_UPDATED,
                title: 'Complaint Status Updated',
                message: `Your complaint "${complaint.title}" is now ${dto.status}.`,
                referenceId: id,
                referenceType: 'complaint',
            });
        }

        return updated;
    }
}
