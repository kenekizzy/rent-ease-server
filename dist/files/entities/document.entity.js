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
exports.Document = exports.DocumentAccessLevel = exports.DocumentFileType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const property_entity_1 = require("../../properties/entities/property.entity");
const lease_entity_1 = require("../../lease/entities/lease.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var DocumentFileType;
(function (DocumentFileType) {
    DocumentFileType["PDF"] = "pdf";
    DocumentFileType["IMAGE"] = "image";
    DocumentFileType["TEXT"] = "text";
    DocumentFileType["SPREADSHEET"] = "spreadsheet";
    DocumentFileType["OTHER"] = "other";
})(DocumentFileType || (exports.DocumentFileType = DocumentFileType = {}));
var DocumentAccessLevel;
(function (DocumentAccessLevel) {
    DocumentAccessLevel["LANDLORD"] = "landlord";
    DocumentAccessLevel["TENANT"] = "tenant";
    DocumentAccessLevel["BOTH"] = "both";
})(DocumentAccessLevel || (exports.DocumentAccessLevel = DocumentAccessLevel = {}));
let Document = class Document extends base_entity_1.BaseEntity {
    uploadedById;
    leaseId;
    propertyId;
    fileName;
    filePath;
    fileType;
    mimeType;
    fileSizeKb;
    version;
    accessLevel;
    uploadedBy;
    lease;
    property;
};
exports.Document = Document;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'uploaded_by' }),
    __metadata("design:type", String)
], Document.prototype, "uploadedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'lease_id', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "leaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'property_id', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'file_name' }),
    __metadata("design:type", String)
], Document.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, name: 'file_path' }),
    __metadata("design:type", String)
], Document.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DocumentFileType, name: 'file_type' }),
    __metadata("design:type", String)
], Document.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'mime_type' }),
    __metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'file_size_kb' }),
    __metadata("design:type", Number)
], Document.prototype, "fileSizeKb", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Document.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentAccessLevel,
        name: 'access_level',
        default: DocumentAccessLevel.BOTH,
    }),
    __metadata("design:type", String)
], Document.prototype, "accessLevel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.documents),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by' }),
    __metadata("design:type", user_entity_1.User)
], Document.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lease_entity_1.Lease, (lease) => lease.documents, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lease_id' }),
    __metadata("design:type", lease_entity_1.Lease)
], Document.prototype, "lease", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.documents, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Document.prototype, "property", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)('documents')
], Document);
//# sourceMappingURL=document.entity.js.map