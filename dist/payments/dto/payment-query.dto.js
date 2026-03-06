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
exports.PaymentReportQueryDto = exports.PaymentQueryDto = void 0;
const class_validator_1 = require("class-validator");
const payment_entity_1 = require("../entities/payment.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const date_range_dto_1 = require("../../common/dto/date-range.dto");
class PaymentQueryDto extends pagination_dto_1.PaginationDto {
    status;
    leaseId;
    propertyId;
    tenantId;
}
exports.PaymentQueryDto = PaymentQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentStatus, {
        message: 'Status must be pending, paid, or overdue',
    }),
    __metadata("design:type", String)
], PaymentQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Lease ID must be a valid UUID' }),
    __metadata("design:type", String)
], PaymentQueryDto.prototype, "leaseId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Property ID must be a valid UUID' }),
    __metadata("design:type", String)
], PaymentQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Tenant ID must be a valid UUID' }),
    __metadata("design:type", String)
], PaymentQueryDto.prototype, "tenantId", void 0);
class PaymentReportQueryDto extends date_range_dto_1.DateRangeDto {
    propertyId;
    landlordId;
}
exports.PaymentReportQueryDto = PaymentReportQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Property ID must be a valid UUID' }),
    __metadata("design:type", String)
], PaymentReportQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Landlord ID must be a valid UUID' }),
    __metadata("design:type", String)
], PaymentReportQueryDto.prototype, "landlordId", void 0);
//# sourceMappingURL=payment-query.dto.js.map