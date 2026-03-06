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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const property_entity_1 = require("../../properties/entities/property.entity");
const lease_entity_1 = require("../../lease/entities/lease.entity");
const complaint_entity_1 = require("../../properties/entities/complaint.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
const notification_preferences_entity_1 = require("../../notifications/entities/notification-preferences.entity");
const entities_1 = require("../../payments/entities");
const entities_2 = require("../../files/entities");
var UserRole;
(function (UserRole) {
    UserRole["LANDLORD"] = "landlord";
    UserRole["TENANT"] = "tenant";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User extends base_entity_1.BaseEntity {
    email;
    password;
    avatar;
    firstName;
    lastName;
    emailVerified;
    phone;
    role;
    isActive;
    properties;
    landlordLeases;
    tenantLeases;
    tenantPayments;
    landlordPayments;
    submittedComplaints;
    receivedComplaints;
    documents;
    notifications;
    notificationPreference;
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'password' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'first_name' }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'last_name' }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 14, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_entity_1.Property, (property) => property.landlord),
    __metadata("design:type", Array)
], User.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lease_entity_1.Lease, (lease) => lease.landlord),
    __metadata("design:type", Array)
], User.prototype, "landlordLeases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lease_entity_1.Lease, (lease) => lease.tenant),
    __metadata("design:type", Array)
], User.prototype, "tenantLeases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_1.Payment, (payment) => payment.tenant),
    __metadata("design:type", Array)
], User.prototype, "tenantPayments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_1.Payment, (payment) => payment.landlord),
    __metadata("design:type", Array)
], User.prototype, "landlordPayments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_entity_1.Complaint, (complaint) => complaint.tenant),
    __metadata("design:type", Array)
], User.prototype, "submittedComplaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_entity_1.Complaint, (complaint) => complaint.landlord),
    __metadata("design:type", Array)
], User.prototype, "receivedComplaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_2.Document, (doc) => doc.uploadedBy),
    __metadata("design:type", Array)
], User.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.AppNotification, (notif) => notif.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => notification_preferences_entity_1.NotificationPreference, (pref) => pref.user),
    __metadata("design:type", notification_preferences_entity_1.NotificationPreference)
], User.prototype, "notificationPreference", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map