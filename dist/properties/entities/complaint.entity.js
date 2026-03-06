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
exports.Complaint = exports.ComplaintStatus = exports.ComplaintPriority = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const property_entity_1 = require("./property.entity");
const lease_entity_1 = require("../../lease/entities/lease.entity");
var ComplaintPriority;
(function (ComplaintPriority) {
    ComplaintPriority["LOW"] = "low";
    ComplaintPriority["MEDIUM"] = "medium";
    ComplaintPriority["HIGH"] = "high";
    ComplaintPriority["URGENT"] = "urgent";
})(ComplaintPriority || (exports.ComplaintPriority = ComplaintPriority = {}));
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["OPEN"] = "open";
    ComplaintStatus["IN_PROGRESS"] = "in_progress";
    ComplaintStatus["RESOLVED"] = "resolved";
    ComplaintStatus["CLOSED"] = "closed";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
let Complaint = class Complaint extends base_entity_1.BaseEntity {
    tenantId;
    landlordId;
    propertyId;
    leaseId;
    title;
    description;
    priority;
    status;
    resolutionNotes;
    resolvedAt;
    tenant;
    landlord;
    property;
    lease;
};
exports.Complaint = Complaint;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Complaint.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'landlord_id' }),
    __metadata("design:type", String)
], Complaint.prototype, "landlordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'property_id' }),
    __metadata("design:type", String)
], Complaint.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'lease_id' }),
    __metadata("design:type", String)
], Complaint.prototype, "leaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Complaint.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ComplaintPriority, default: ComplaintPriority.MEDIUM }),
    __metadata("design:type", String)
], Complaint.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ComplaintStatus, default: ComplaintStatus.OPEN }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'resolution_notes', nullable: true }),
    __metadata("design:type", String)
], Complaint.prototype, "resolutionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'resolved_at', nullable: true }),
    __metadata("design:type", Date)
], Complaint.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.submittedComplaints),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", user_entity_1.User)
], Complaint.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.receivedComplaints),
    (0, typeorm_1.JoinColumn)({ name: 'landlord_id' }),
    __metadata("design:type", user_entity_1.User)
], Complaint.prototype, "landlord", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.complaints),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Complaint.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lease_entity_1.Lease, (lease) => lease.complaints),
    (0, typeorm_1.JoinColumn)({ name: 'lease_id' }),
    __metadata("design:type", lease_entity_1.Lease)
], Complaint.prototype, "lease", void 0);
exports.Complaint = Complaint = __decorate([
    (0, typeorm_1.Entity)('complaints')
], Complaint);
//# sourceMappingURL=complaint.entity.js.map