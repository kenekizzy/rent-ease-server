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
exports.Payment = exports.PaymentMethod = exports.PaymentStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const lease_entity_1 = require("../../lease/entities/lease.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["OVERDUE"] = "overdue";
    PaymentStatus["PARTIAL"] = "partial";
    PaymentStatus["WAIVED"] = "waived";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CHECK"] = "check";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["ONLINE"] = "online";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Payment = class Payment extends base_entity_1.BaseEntity {
    leaseId;
    tenantId;
    landlordId;
    amount;
    dueDate;
    paidDate;
    status;
    paymentMethod;
    transactionRef;
    transactionDocument;
    periodYear;
    amountPaid;
    notes;
    lease;
    tenant;
    landlord;
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'lease_id' }),
    __metadata("design:type", String)
], Payment.prototype, "leaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Payment.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'landlord_id' }),
    __metadata("design:type", String)
], Payment.prototype, "landlordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'due_date' }),
    __metadata("design:type", Date)
], Payment.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'paid_date', nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "paidDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        name: 'payment_method',
        nullable: true,
    }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        name: 'transaction_ref',
        nullable: true,
    }),
    __metadata("design:type", String)
], Payment.prototype, "transactionRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'transaction_document' }),
    __metadata("design:type", String)
], Payment.prototype, "transactionDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'period_year' }),
    __metadata("design:type", Number)
], Payment.prototype, "periodYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'amount_paid', nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lease_entity_1.Lease, (lease) => lease.payments),
    (0, typeorm_1.JoinColumn)({ name: 'lease_id' }),
    __metadata("design:type", lease_entity_1.Lease)
], Payment.prototype, "lease", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tenantPayments),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.landlordPayments),
    (0, typeorm_1.JoinColumn)({ name: 'landlord_id' }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "landlord", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('payments')
], Payment);
//# sourceMappingURL=payment.entity.js.map