"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const document_entity_1 = require("./entities/document.entity");
const ALLOWED_MIME_TYPES = {
    'application/pdf': document_entity_1.DocumentFileType.PDF,
    'image/jpeg': document_entity_1.DocumentFileType.IMAGE,
    'image/png': document_entity_1.DocumentFileType.IMAGE,
    'image/webp': document_entity_1.DocumentFileType.IMAGE,
    'text/plain': document_entity_1.DocumentFileType.TEXT,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': document_entity_1.DocumentFileType.SPREADSHEET,
    'application/vnd.ms-excel': document_entity_1.DocumentFileType.SPREADSHEET,
};
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './uploads/documents';
let FilesService = class FilesService {
    documentRepository;
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }
    async uploadDocument(file, documentDto, uploadedById) {
        if (!file)
            throw new common_1.BadRequestException('No file provided.');
        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new common_1.BadRequestException('File exceeds the 10 MB size limit.');
        }
        const fileType = ALLOWED_MIME_TYPES[file.mimetype];
        if (!fileType) {
            throw new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}. Allowed: PDF, images, plain text, Excel.`);
        }
        if (!documentDto.leaseId && !documentDto.propertyId) {
            throw new common_1.BadRequestException('Either leaseId or propertyId must be provided.');
        }
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const ext = path.extname(file.originalname);
        const storedName = `${Date.now()}-${uploadedById}${ext}`;
        const filePath = path.join(UPLOAD_DIR, storedName);
        await fs.writeFile(filePath, file.buffer);
        const existing = await this.documentRepository.findOne({
            where: {
                uploadedById,
                ...(documentDto.leaseId ? { leaseId: documentDto.leaseId } : {}),
                ...(documentDto.propertyId ? { propertyId: documentDto.propertyId } : {}),
            },
            order: { version: 'DESC' },
        });
        const version = existing ? existing.version + 1 : 1;
        const document = this.documentRepository.create({
            uploadedById,
            leaseId: documentDto.leaseId,
            propertyId: documentDto.propertyId,
            fileName: file.originalname,
            filePath,
            fileType,
            mimeType: file.mimetype,
            fileSizeKb: Math.ceil(file.size / 1024),
            version,
            accessLevel: documentDto.accessLevel ?? document_entity_1.DocumentAccessLevel.BOTH,
        });
        return this.documentRepository.save(document);
    }
    async findById(id, requestingUserId) {
        const doc = await this.documentRepository.findOne({ where: { id } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found.');
        if (doc.uploadedById !== requestingUserId) {
            if (doc.accessLevel === document_entity_1.DocumentAccessLevel.LANDLORD) {
                throw new common_1.ForbiddenException('Only the landlord can access this document.');
            }
            if (doc.accessLevel === document_entity_1.DocumentAccessLevel.TENANT) {
                throw new common_1.ForbiddenException('Only the tenant can access this document.');
            }
        }
        return doc;
    }
    async findByLease(leaseId) {
        return this.documentRepository.find({
            where: { leaseId },
            order: { createdAt: 'DESC' },
        });
    }
    async findByProperty(propertyId) {
        return this.documentRepository.find({
            where: { propertyId },
            order: { createdAt: 'DESC' },
        });
    }
    async delete(id, requestingUserId) {
        const doc = await this.documentRepository.findOne({ where: { id } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found.');
        if (doc.uploadedById !== requestingUserId) {
            throw new common_1.ForbiddenException('You can only delete documents you uploaded.');
        }
        await fs.unlink(doc.filePath).catch(() => null);
        await this.documentRepository.remove(doc);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FilesService);
//# sourceMappingURL=files.service.js.map