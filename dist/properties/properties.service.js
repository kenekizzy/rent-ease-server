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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./entities/property.entity");
const property_entity_2 = require("./entities/property.entity");
let PropertiesService = class PropertiesService {
    propertyRepository;
    constructor(propertyRepository) {
        this.propertyRepository = propertyRepository;
    }
    async create(landlordId, dto) {
        const property = this.propertyRepository.create({ ...dto, landlordId });
        return this.propertyRepository.save(property);
    }
    async findAll(landlordId) {
        return this.propertyRepository.find({
            where: { landlordId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, landlordId) {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['leases', 'leases.tenant', 'complaints', 'documents'],
        });
        this.assertExists(property);
        this.assertOwner(property, landlordId);
        return property;
    }
    async update(id, landlordId, dto) {
        const property = await this.propertyRepository.findOne({ where: { id } });
        this.assertExists(property);
        this.assertOwner(property, landlordId);
        Object.assign(property, dto);
        return this.propertyRepository.save(property);
    }
    async remove(id, landlordId) {
        const property = await this.propertyRepository.findOne({ where: { id } });
        this.assertExists(property);
        this.assertOwner(property, landlordId);
        await this.propertyRepository.remove(property);
    }
    async getOccupancySummary(landlordId) {
        const properties = await this.propertyRepository.find({ where: { landlordId } });
        const total = properties.length;
        const occupied = properties.filter((p) => p.status === property_entity_2.PropertyStatus.OCCUPIED).length;
        const available = properties.filter((p) => p.status === property_entity_2.PropertyStatus.AVAILABLE).length;
        const maintenance = properties.filter((p) => p.status === property_entity_2.PropertyStatus.MAINTENANCE).length;
        return {
            total,
            occupied,
            available,
            maintenance,
            occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
        };
    }
    async findById(id) {
        const p = await this.propertyRepository.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Property not found.');
        return p;
    }
    async setStatus(id, status) {
        await this.propertyRepository.update(id, { status });
    }
    assertExists(p) {
        if (!p)
            throw new common_1.NotFoundException('Property not found.');
    }
    assertOwner(p, landlordId) {
        if (p.landlordId !== landlordId) {
            throw new common_1.ForbiddenException('You do not own this property.');
        }
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map