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
exports.NotificationPreference = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let NotificationPreference = class NotificationPreference {
    id;
    userId;
    emailEnabled;
    inAppEnabled;
    complaintAlerts;
    paymentAlerts;
    rentReminders;
    documentAlerts;
    reminderDaysBefore;
    updatedAt;
    user;
};
exports.NotificationPreference = NotificationPreference;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotificationPreference.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id', unique: true }),
    __metadata("design:type", String)
], NotificationPreference.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'email_enabled', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "emailEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'in_app_enabled', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "inAppEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'complaint_alerts', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "complaintAlerts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'payment_alerts', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "paymentAlerts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'rent_reminders', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "rentReminders", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'document_alerts', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "documentAlerts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'reminder_days_before', default: 3 }),
    __metadata("design:type", Number)
], NotificationPreference.prototype, "reminderDaysBefore", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], NotificationPreference.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.notificationPreference),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], NotificationPreference.prototype, "user", void 0);
exports.NotificationPreference = NotificationPreference = __decorate([
    (0, typeorm_1.Entity)('notification_preferences')
], NotificationPreference);
//# sourceMappingURL=notification-preferences.entity.js.map