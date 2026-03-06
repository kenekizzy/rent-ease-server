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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notification_preferences_entity_1 = require("./entities/notification-preferences.entity");
let NotificationsService = class NotificationsService {
    notificationRepository;
    preferenceRepository;
    constructor(notificationRepository, preferenceRepository) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }
    async send(dto) {
        const prefs = await this.preferenceRepository.findOne({
            where: { userId: dto.userId },
        });
        if (prefs) {
            if (this.isTypeDisabled(dto.type, prefs)) {
                return null;
            }
            if (!prefs.inAppEnabled) {
            }
        }
        const notification = this.notificationRepository.create({
            ...dto,
            isRead: dto.read ?? false,
        });
        const saved = await this.notificationRepository.save(notification);
        return saved;
    }
    isTypeDisabled(type, prefs) {
        switch (type) {
            case notification_entity_1.NotificationType.COMPLAINT_SUBMITTED:
            case notification_entity_1.NotificationType.COMPLAINT_UPDATED:
            case notification_entity_1.NotificationType.COMPLAINT_RESOLVED:
                return !prefs.complaintAlerts;
            case notification_entity_1.NotificationType.PAYMENT_DUE:
            case notification_entity_1.NotificationType.PAYMENT_RECEIVED:
            case notification_entity_1.NotificationType.PAYMENT_OVERDUE:
                return !prefs.paymentAlerts;
            case notification_entity_1.NotificationType.RENT_INCREASE:
                return !prefs.rentReminders;
            case notification_entity_1.NotificationType.DOCUMENT_UPLOADED:
            case notification_entity_1.NotificationType.DOCUMENT_UPDATED:
                return !prefs.documentAlerts;
            default:
                return false;
        }
    }
    async findAllForUser(userId) {
        return this.notificationRepository.find({
            where: { userId },
            order: { sentAt: 'DESC' },
        });
    }
    async markAsRead(id) {
        await this.notificationRepository.update(id, { isRead: true, readAt: new Date() });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.AppNotification)),
    __param(1, (0, typeorm_1.InjectRepository)(notification_preferences_entity_1.NotificationPreference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map