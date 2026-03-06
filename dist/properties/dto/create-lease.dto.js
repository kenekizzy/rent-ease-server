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
exports.CreateLeaseDto = void 0;
const class_validator_1 = require("class-validator");
const lease_entity_1 = require("../../lease/entities/lease.entity");
const date_range_validator_1 = require("../../common/validators/date-range.validator");
class CreateLeaseDto {
    startDate;
    endDate;
    rentAmount;
    securityDeposit;
    propertyId;
    tenantId;
    status;
}
exports.CreateLeaseDto = CreateLeaseDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Start date must be a valid date' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Start date is required' }),
    __metadata("design:type", String)
], CreateLeaseDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'End date must be a valid date' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'End date is required' }),
    (0, date_range_validator_1.IsAfterDate)('startDate', { message: 'End date must be after start date' }),
    __metadata("design:type", String)
], CreateLeaseDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Rent amount must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Rent amount must be positive' }),
    __metadata("design:type", Number)
], CreateLeaseDto.prototype, "rentAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Security deposit must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Security deposit must be positive' }),
    __metadata("design:type", Number)
], CreateLeaseDto.prototype, "securityDeposit", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'Property ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Property ID is required' }),
    __metadata("design:type", String)
], CreateLeaseDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'Tenant ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tenant ID is required' }),
    __metadata("design:type", String)
], CreateLeaseDto.prototype, "tenantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(lease_entity_1.LeaseStatus, {
        message: 'Status must be active, expired, or terminated',
    }),
    __metadata("design:type", String)
], CreateLeaseDto.prototype, "status", void 0);
//# sourceMappingURL=create-lease.dto.js.map