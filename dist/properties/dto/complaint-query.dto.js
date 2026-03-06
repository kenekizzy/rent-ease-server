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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintQueryDto = void 0;
const class_validator_1 = require("class-validator");
const complaint_entity_1 = require("../entities/complaint.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class ComplaintQueryDto extends pagination_dto_1.PaginationDto {
    status;
    priority;
    propertyId;
    tenantId;
}
exports.ComplaintQueryDto = ComplaintQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(complaint_entity_1.ComplaintStatus, {
        message: 'Status must be open, in_progress, resolved, or closed',
    }),
    __metadata("design:type", String)
], ComplaintQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(complaint_entity_1.ComplaintPriority, {
        message: 'Priority must be low, medium, high, or urgent',
    }),
    __metadata("design:type", String)
], ComplaintQueryDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Property ID must be a valid UUID' }),
    __metadata("design:type", String)
], ComplaintQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Tenant ID must be a valid UUID' }),
    __metadata("design:type", String)
], ComplaintQueryDto.prototype, "tenantId", void 0);
//# sourceMappingURL=complaint-query.dto.js.map