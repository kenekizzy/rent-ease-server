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
exports.NotificationQueryDto = void 0;
const class_validator_1 = require("class-validator");
const notification_entity_1 = require("../entities/notification.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class NotificationQueryDto extends pagination_dto_1.PaginationDto {
    type;
    read;
    userId;
}
exports.NotificationQueryDto = NotificationQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType, {
        message: 'Type must be one of: complaint_submitted, complaint_status_updated, rent_due, payment_received, payment_overdue, rent_increase, lease_expiring, document_uploaded',
    }),
    __metadata("design:type", String)
], NotificationQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Read status must be a boolean' }),
    __metadata("design:type", Boolean)
], NotificationQueryDto.prototype, "read", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'User ID must be a valid UUID' }),
    __metadata("design:type", String)
], NotificationQueryDto.prototype, "userId", void 0);
//# sourceMappingURL=notification-query.dto.js.map