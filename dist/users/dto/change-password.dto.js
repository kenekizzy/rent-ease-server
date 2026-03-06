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
exports.ChangePasswordDto = void 0;
const class_validator_1 = require("class-validator");
const match_validator_1 = require("../../common/validators/match.validator");
class ChangePasswordDto {
    currentPassword;
    newPassword;
    confirmPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Current password must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Current password is required' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'New password must be a string' }),
    (0, class_validator_1.MinLength)(8, { message: 'New password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'New password must contain at least one lowercase letter, one uppercase letter, and one number',
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Confirm password must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Confirm password is required' }),
    (0, match_validator_1.Match)('newPassword', { message: 'Confirm password must match new password' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=change-password.dto.js.map