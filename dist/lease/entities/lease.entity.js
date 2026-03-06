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
exports.Lease = exports.LeaseStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const property_entity_1 = require("../../properties/entities/property.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
const complaint_entity_1 = require("../../properties/entities/complaint.entity");
const document_entity_1 = require("../../files/entities/document.entity");
var LeaseStatus;
(function (LeaseStatus) {
    LeaseStatus["ACTIVE"] = "active";
    LeaseStatus["EXPIRED"] = "expired";
    LeaseStatus["TERMINATED"] = "terminated";
})(LeaseStatus || (exports.LeaseStatus = LeaseStatus = {}));
let Lease = class Lease extends base_entity_1.BaseEntity {
    propertyId;
    tenantId;
    landlordId;
    startDate;
    endDate;
    annualRent;
    securityDeposit;
    annualDueDate;
    status;
    termsText;
    property;
    tenant;
    landlord;
    payments;
    complaints;
    documents;
};
exports.Lease = Lease;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'property_id' }),
    __metadata("design:type", String)
], Lease.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Lease.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'landlord_id' }),
    __metadata("design:type", String)
], Lease.prototype, "landlordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'start_date' }),
    __metadata("design:type", Date)
], Lease.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'end_date' }),
    __metadata("design:type", Date)
], Lease.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'annual_rent' }),
    __metadata("design:type", Number)
], Lease.prototype, "annualRent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'security_deposit' }),
    __metadata("design:type", Number)
], Lease.prototype, "securityDeposit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'annual_due_date' }),
    __metadata("design:type", Date)
], Lease.prototype, "annualDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LeaseStatus,
        default: LeaseStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Lease.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'terms_text', nullable: true }),
    __metadata("design:type", String)
], Lease.prototype, "termsText", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.leases),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Lease.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tenantLeases),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", user_entity_1.User)
], Lease.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.landlordLeases),
    (0, typeorm_1.JoinColumn)({ name: 'landlord_id' }),
    __metadata("design:type", user_entity_1.User)
], Lease.prototype, "landlord", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.lease),
    __metadata("design:type", Array)
], Lease.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_entity_1.Complaint, (complaint) => complaint.lease),
    __metadata("design:type", Array)
], Lease.prototype, "complaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (doc) => doc.lease),
    __metadata("design:type", Array)
], Lease.prototype, "documents", void 0);
exports.Lease = Lease = __decorate([
    (0, typeorm_1.Entity)('leases'),
    (0, typeorm_1.Check)(`"end_date" > "start_date"`)
], Lease);
//# sourceMappingURL=lease.entity.js.map