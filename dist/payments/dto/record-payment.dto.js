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
exports.RecordPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const payment_entity_1 = require("../entities/payment.entity");
class RecordPaymentDto {
    paidDate;
    paymentMethod;
    notes;
    status;
}
exports.RecordPaymentDto = RecordPaymentDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Paid date must be a valid date' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Paid date is required' }),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paidDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Payment method must be a string' }),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Notes must be a string' }),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentStatus, {
        message: 'Status must be pending, paid, or overdue',
    }),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "status", void 0);
//# sourceMappingURL=record-payment.dto.js.map