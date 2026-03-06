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
exports.CreateDocumentDto = void 0;
const class_validator_1 = require("class-validator");
const document_entity_1 = require("../entities/document.entity");
const file_validator_1 = require("../../common/validators/file.validator");
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
class CreateDocumentDto {
    filename;
    filePath;
    mimeType;
    fileSize;
    documentType;
    propertyId;
    leaseId;
    accessLevel;
}
exports.CreateDocumentDto = CreateDocumentDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Filename must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Filename is required' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'File path must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File path is required' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "filePath", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'MIME type must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'MIME type is required' }),
    (0, file_validator_1.IsValidMimeType)(ALLOWED_MIME_TYPES, {
        message: 'File type not supported. Allowed types: PDF, images (JPEG, PNG, GIF), text files, and Word documents',
    }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "mimeType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'File size must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'File size must be positive' }),
    (0, file_validator_1.IsValidFileSize)(MAX_FILE_SIZE, {
        message: 'File size must not exceed 10 MB',
    }),
    __metadata("design:type", Number)
], CreateDocumentDto.prototype, "fileSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(document_entity_1.DocumentFileType, {
        message: 'Document type must be one of: lease_agreement, property_photo, inspection_report, receipt, maintenance_record, other',
    }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'Property ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Property ID is required' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'Lease ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Lease ID is required' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "leaseId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(document_entity_1.DocumentAccessLevel, {
        message: 'Access level must be one of: landlord, tenant, both',
    }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "accessLevel", void 0);
//# sourceMappingURL=create-document.dto.js.map