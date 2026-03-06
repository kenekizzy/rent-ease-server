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
exports.CreatePropertyDto = void 0;
const class_validator_1 = require("class-validator");
const property_entity_1 = require("../entities/property.entity");
class CreatePropertyDto {
    address;
    city;
    state;
    zipCode;
    rentAmount;
    description;
    status;
}
exports.CreatePropertyDto = CreatePropertyDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Address must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Address is required' }),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'City must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'City is required' }),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'State must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'State is required' }),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'ZIP code must be a string' }),
    (0, class_validator_1.Matches)(/^\d{5}(-\d{4})?$/, {
        message: 'ZIP code must be in format 12345 or 12345-6789',
    }),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "zipCode", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Rent amount must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Rent amount must be positive' }),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "rentAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_entity_1.PropertyStatus, {
        message: 'Status must be available, occupied, or maintenance',
    }),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "status", void 0);
//# sourceMappingURL=create-property.dto.js.map