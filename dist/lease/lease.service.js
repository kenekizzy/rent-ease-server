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
exports.LeaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lease_entity_1 = require("./entities/lease.entity");
const property_entity_1 = require("../properties/entities/property.entity");
const users_service_1 = require("../users/users.service");
const properties_service_1 = require("../properties/properties.service");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let LeaseService = class LeaseService {
    leaseRepository;
    usersService;
    propertiesService;
    notificationsService;
    constructor(leaseRepository, usersService, propertiesService, notificationsService) {
        this.leaseRepository = leaseRepository;
        this.usersService = usersService;
        this.propertiesService = propertiesService;
        this.notificationsService = notificationsService;
    }
    async create(landlordId, dto) {
        const property = await this.propertiesService.findById(dto.propertyId);
        if (property.landlordId !== landlordId) {
            throw new common_1.ForbiddenException('You do not own this property.');
        }
        if (property.status === property_entity_1.PropertyStatus.OCCUPIED) {
            throw new common_1.BadRequestException('Property is already occupied.');
        }
        const lease = this.leaseRepository.create({
            ...dto,
            landlordId,
            annualDueDate: dto.annualDueDate ?? dto.startDate,
        });
        const saved = await this.leaseRepository.save(lease);
        await this.propertiesService.setStatus(dto.propertyId, property_entity_1.PropertyStatus.OCCUPIED);
        await this.notificationsService.send({
            userId: dto.tenantId,
            type: notification_entity_1.NotificationType.LEASE_CREATED,
            title: 'New Lease Agreement',
            message: `A lease has been created for your tenancy at ${property.addressLine1}.`,
            referenceId: saved.id,
            referenceType: 'lease',
        });
        return saved;
    }
    async findAllForLandlord(landlordId) {
        return this.leaseRepository.find({
            where: { landlordId },
            relations: ['tenant', 'property'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllForTenant(tenantId) {
        return this.leaseRepository.find({
            where: { tenantId },
            relations: ['property', 'landlord'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const lease = await this.leaseRepository.findOne({
            where: { id },
            relations: ['tenant', 'landlord', 'property', 'paymentRecords', 'documents'],
        });
        this.assertExists(lease);
        this.assertParticipant(lease, userId);
        return lease;
    }
    async update(id, landlordId, dto) {
        const lease = await this.leaseRepository.findOne({ where: { id } });
        this.assertExists(lease);
        if (lease.landlordId !== landlordId) {
            throw new common_1.ForbiddenException('Only the landlord can modify this lease.');
        }
        const previousRent = lease.annualRent;
        Object.assign(lease, dto);
        const updated = await this.leaseRepository.save(lease);
        if (dto.annualRent && dto.annualRent !== previousRent) {
            await this.notificationsService.send({
                userId: lease.tenantId,
                type: notification_entity_1.NotificationType.RENT_INCREASE,
                title: 'Rent Update',
                message: `Your annual rent has been updated from $${previousRent} to $${dto.annualRent}.`,
                referenceId: id,
                referenceType: 'lease',
            });
        }
        return updated;
    }
    async terminate(id, landlordId, dto) {
        const lease = await this.leaseRepository.findOne({
            where: { id },
            relations: ['property'],
        });
        this.assertExists(lease);
        if (lease.landlordId !== landlordId) {
            throw new common_1.ForbiddenException('Only the landlord can terminate this lease.');
        }
        if (lease.status !== lease_entity_1.LeaseStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active leases can be terminated.');
        }
        lease.status = lease_entity_1.LeaseStatus.TERMINATED;
        lease.endDate = new Date();
        const updated = await this.leaseRepository.save(lease);
        await this.propertiesService.setStatus(lease.propertyId, property_entity_1.PropertyStatus.AVAILABLE);
        await this.notificationsService.send({
            userId: lease.tenantId,
            type: notification_entity_1.NotificationType.LEASE_TERMINATED,
            title: 'Lease Terminated',
            message: `Your lease has been terminated. Reason: ${dto.reason}`,
            referenceId: id,
            referenceType: 'lease',
        });
        return updated;
    }
    async findById(id) {
        const lease = await this.leaseRepository.findOne({ where: { id } });
        if (!lease)
            throw new common_1.NotFoundException('Lease not found.');
        return lease;
    }
    assertExists(l) {
        if (!l)
            throw new common_1.NotFoundException('Lease not found.');
    }
    assertParticipant(l, userId) {
        if (l.landlordId !== userId && l.tenantId !== userId) {
            throw new common_1.ForbiddenException('You are not a participant of this lease.');
        }
    }
};
exports.LeaseService = LeaseService;
exports.LeaseService = LeaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lease_entity_1.Lease)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        properties_service_1.PropertiesService,
        notifications_service_1.NotificationsService])
], LeaseService);
//# sourceMappingURL=lease.service.js.map