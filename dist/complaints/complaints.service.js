"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const complaint_entity_1 = require("./entities/complaint.entity");
const lease_entity_1 = require("../lease/entities/lease.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let ComplaintsService = class ComplaintsService {
    complaintRepository;
    leaseRepository;
    notificationsService;
    constructor(complaintRepository, leaseRepository, notificationsService) {
        this.complaintRepository = complaintRepository;
        this.leaseRepository = leaseRepository;
        this.notificationsService = notificationsService;
    }
    async create(tenantId, dto) {
        const lease = await this.leaseRepository.findOne({
            where: {
                tenantId,
                propertyId: dto.propertyId,
                status: lease_entity_1.LeaseStatus.ACTIVE,
            },
            relations: ['property'],
        });
        if (!lease) {
            throw new common_1.BadRequestException('No active lease found for this property.');
        }
        const complaint = this.complaintRepository.create({
            ...dto,
            tenantId,
            landlordId: lease.landlordId,
            leaseId: lease.id,
        });
        const saved = await this.complaintRepository.save(complaint);
        await this.notificationsService.send({
            userId: lease.landlordId,
            type: notification_entity_1.NotificationType.COMPLAINT_SUBMITTED,
            title: 'New Complaint Submitted',
            message: `A new complaint has been submitted for ${lease.property.addressLine1}: ${dto.title}`,
            referenceId: saved.id,
            referenceType: 'complaint',
        });
        return saved;
    }
    async findAll(userId, role) {
        const where = role === 'landlord' ? { landlordId: userId } : { tenantId: userId };
        return this.complaintRepository.find({
            where,
            relations: ['property', 'tenant', 'lease'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const complaint = await this.complaintRepository.findOne({
            where: { id },
            relations: ['property', 'tenant', 'landlord', 'lease'],
        });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found.');
        if (complaint.tenantId !== userId && complaint.landlordId !== userId) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        return complaint;
    }
    async update(id, userId, dto) {
        const complaint = await this.findOne(id, userId);
        if (dto.status && complaint.landlordId !== userId) {
            throw new common_1.ForbiddenException('Only the landlord can update complaint status.');
        }
        const previousStatus = complaint.status;
        Object.assign(complaint, dto);
        if (dto.status === complaint_entity_1.ComplaintStatus.RESOLVED && previousStatus !== complaint_entity_1.ComplaintStatus.RESOLVED) {
            complaint.resolvedAt = new Date();
        }
        const updated = await this.complaintRepository.save(complaint);
        if (dto.status && dto.status !== previousStatus) {
            await this.notificationsService.send({
                userId: complaint.tenantId,
                type: notification_entity_1.NotificationType.COMPLAINT_UPDATED,
                title: 'Complaint Status Updated',
                message: `Your complaint "${complaint.title}" is now ${dto.status}.`,
                referenceId: id,
                referenceType: 'complaint',
            });
        }
        return updated;
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(complaint_entity_1.Complaint)),
    __param(1, (0, typeorm_1.InjectRepository)(lease_entity_1.Lease)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map