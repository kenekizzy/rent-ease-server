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
exports.Property = exports.PropertyStatus = exports.PropertyType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const lease_entity_1 = require("../../lease/entities/lease.entity");
const complaint_entity_1 = require("../../complaints/entities/complaint.entity");
const document_entity_1 = require("../../files/entities/document.entity");
var PropertyType;
(function (PropertyType) {
    PropertyType["APARTMENT"] = "apartment";
    PropertyType["HOUSE"] = "house";
    PropertyType["CONDO"] = "condo";
    PropertyType["STUDIO"] = "studio";
    PropertyType["TOWNHOUSE"] = "townhouse";
    PropertyType["COMMERCIAL"] = "commercial";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["AVAILABLE"] = "available";
    PropertyStatus["OCCUPIED"] = "occupied";
    PropertyStatus["MAINTENANCE"] = "maintenance";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
let Property = class Property extends base_entity_1.BaseEntity {
    landlordId;
    addressLine1;
    addressLine2;
    city;
    state;
    zipCode;
    propertyType;
    rentAmount;
    status;
    bedrooms;
    bathrooms;
    landlord;
    leases;
    complaints;
    documents;
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'landlord_id' }),
    __metadata("design:type", String)
], Property.prototype, "landlordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'address_line1' }),
    __metadata("design:type", String)
], Property.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'address_line2', nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Property.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Property.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, name: 'zip_code' }),
    __metadata("design:type", String)
], Property.prototype, "zipCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PropertyType, name: 'property_type' }),
    __metadata("design:type", String)
], Property.prototype, "propertyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'rent_amount' }),
    __metadata("design:type", Number)
], Property.prototype, "rentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyStatus,
        default: PropertyStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "bedrooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "bathrooms", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.properties),
    (0, typeorm_1.JoinColumn)({ name: 'landlord_id' }),
    __metadata("design:type", user_entity_1.User)
], Property.prototype, "landlord", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lease_entity_1.Lease, (lease) => lease.property),
    __metadata("design:type", Array)
], Property.prototype, "leases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_entity_1.Complaint, (complaint) => complaint.property),
    __metadata("design:type", Array)
], Property.prototype, "complaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (doc) => doc.property),
    __metadata("design:type", Array)
], Property.prototype, "documents", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)('properties')
], Property);
//# sourceMappingURL=property.entity.js.map