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
exports.PropertyQueryDto = void 0;
const class_validator_1 = require("class-validator");
const property_entity_1 = require("../entities/property.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class PropertyQueryDto extends pagination_dto_1.PaginationDto {
    status;
    city;
    state;
    landlordId;
}
exports.PropertyQueryDto = PropertyQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(property_entity_1.PropertyStatus, {
        message: 'Status must be available, occupied, or maintenance',
    }),
    __metadata("design:type", String)
], PropertyQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'City must be a string' }),
    __metadata("design:type", String)
], PropertyQueryDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'State must be a string' }),
    __metadata("design:type", String)
], PropertyQueryDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Landlord ID must be a valid UUID' }),
    __metadata("design:type", String)
], PropertyQueryDto.prototype, "landlordId", void 0);
//# sourceMappingURL=property-query.dto.js.map