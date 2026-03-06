import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { DocumentFileType, Document, DocumentAccessLevel } from './entities/document.entity';
import { CreateDocumentDto } from './dto';

const ALLOWED_MIME_TYPES: Record<string, DocumentFileType> = {
  'application/pdf':                DocumentFileType.PDF,
  'image/jpeg':                     DocumentFileType.IMAGE,
  'image/png':                      DocumentFileType.IMAGE,
  'image/webp':                     DocumentFileType.IMAGE,
  'text/plain':                     DocumentFileType.TEXT,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': DocumentFileType.SPREADSHEET,
  'application/vnd.ms-excel':       DocumentFileType.SPREADSHEET,
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './uploads/documents';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
    ) {}

    async uploadDocument(file: Express.Multer.File, documentDto: CreateDocumentDto, uploadedById: string): Promise<Document> {
        if (!file) throw new BadRequestException('No file provided.');

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File exceeds the 10 MB size limit.');
    }

    const fileType = ALLOWED_MIME_TYPES[file.mimetype];
    if (!fileType) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: PDF, images, plain text, Excel.`,
      );
    }

    if (!documentDto.leaseId && !documentDto.propertyId) {
      throw new BadRequestException('Either leaseId or propertyId must be provided.');
    }

    // --- Persist file to disk (swap for S3/GCS in production) ---
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.originalname);
    const storedName = `${Date.now()}-${uploadedById}${ext}`;
    const filePath = path.join(UPLOAD_DIR, storedName);

    await fs.writeFile(filePath, file.buffer);

    // --- Check if a previous version exists for this lease/property ---
    const existing = await this.documentRepository.findOne({
      where: {
        uploadedById,
        ...(documentDto.leaseId    ? { leaseId: documentDto.leaseId }       : {}),
        ...(documentDto.propertyId ? { propertyId: documentDto.propertyId } : {}),
      },
      order: { version: 'DESC' },
    });

    const version = existing ? existing.version + 1 : 1;

    // --- Save DB record ---
    const document = this.documentRepository.create({
      uploadedById,
      leaseId:     documentDto.leaseId,
      propertyId:  documentDto.propertyId,
      fileName:    file.originalname,
      filePath,
      fileType,
      mimeType:    file.mimetype,
      fileSizeKb:  Math.ceil(file.size / 1024),
      version,
      accessLevel: documentDto.accessLevel ?? DocumentAccessLevel.BOTH,
    });

    return this.documentRepository.save(document);
    }

    async findById(id: string, requestingUserId: string): Promise<Document> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found.');

    // Enforce access: uploader always has access; otherwise check access_level
    if (doc.uploadedById !== requestingUserId) {
      if (doc.accessLevel === DocumentAccessLevel.LANDLORD) {
        throw new ForbiddenException('Only the landlord can access this document.');
      }
      if (doc.accessLevel === DocumentAccessLevel.TENANT) {
        throw new ForbiddenException('Only the tenant can access this document.');
      }
    }

    return doc;
  }

  async findByLease(leaseId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { leaseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByProperty(propertyId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { propertyId },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string, requestingUserId: string): Promise<void> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found.');
    if (doc.uploadedById !== requestingUserId) {
      throw new ForbiddenException('You can only delete documents you uploaded.');
    }

    await fs.unlink(doc.filePath).catch(() => null); // remove from disk
    await this.documentRepository.remove(doc);
  }
}
