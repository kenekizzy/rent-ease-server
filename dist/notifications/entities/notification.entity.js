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
exports.AppNotification = exports.NotificationChannel = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["COMPLAINT_SUBMITTED"] = "complaint_submitted";
    NotificationType["COMPLAINT_UPDATED"] = "complaint_updated";
    NotificationType["COMPLAINT_RESOLVED"] = "complaint_resolved";
    NotificationType["PAYMENT_DUE"] = "payment_due";
    NotificationType["PAYMENT_RECEIVED"] = "payment_received";
    NotificationType["PAYMENT_OVERDUE"] = "payment_overdue";
    NotificationType["LEASE_CREATED"] = "lease_created";
    NotificationType["LEASE_EXPIRING"] = "lease_expiring";
    NotificationType["LEASE_TERMINATED"] = "lease_terminated";
    NotificationType["DOCUMENT_UPLOADED"] = "document_uploaded";
    NotificationType["DOCUMENT_UPDATED"] = "document_updated";
    NotificationType["RENT_INCREASE"] = "rent_increase";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["BOTH"] = "both";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
let AppNotification = class AppNotification extends base_entity_1.BaseEntity {
    userId;
    type;
    title;
    message;
    channel;
    isRead;
    referenceId;
    referenceType;
    sentAt;
    readAt;
    user;
};
exports.AppNotification = AppNotification;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], AppNotification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationType }),
    __metadata("design:type", String)
], AppNotification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], AppNotification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AppNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationChannel,
        default: NotificationChannel.IN_APP,
    }),
    __metadata("design:type", String)
], AppNotification.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'is_read', default: false }),
    __metadata("design:type", Boolean)
], AppNotification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], AppNotification.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'reference_type', nullable: true }),
    __metadata("design:type", String)
], AppNotification.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'sent_at' }),
    __metadata("design:type", Date)
], AppNotification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'read_at', nullable: true }),
    __metadata("design:type", Date)
], AppNotification.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notifications),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], AppNotification.prototype, "user", void 0);
exports.AppNotification = AppNotification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], AppNotification);
//# sourceMappingURL=notification.entity.js.map