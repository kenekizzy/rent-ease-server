import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { DocumentFileType, DocumentAccessLevel } from '../entities/document.entity';
import {
  IsValidMimeType,
  IsValidFileSize,
} from '../../common/validators/file.validator';

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class CreateDocumentDto {
  @IsString({ message: 'Filename must be a string' })
  @IsNotEmpty({ message: 'Filename is required' })
  filename: string;

  @IsString({ message: 'File path must be a string' })
  @IsNotEmpty({ message: 'File path is required' })
  filePath: string;

  @IsString({ message: 'MIME type must be a string' })
  @IsNotEmpty({ message: 'MIME type is required' })
  @IsValidMimeType(ALLOWED_MIME_TYPES, {
    message:
      'File type not supported. Allowed types: PDF, images (JPEG, PNG, GIF), text files, and Word documents',
  })
  mimeType: string;

  @IsNumber({}, { message: 'File size must be a number' })
  @IsPositive({ message: 'File size must be positive' })
  @IsValidFileSize(MAX_FILE_SIZE, {
    message: 'File size must not exceed 10 MB',
  })
  fileSize: number;

  @IsOptional()
  @IsEnum(DocumentFileType, {
    message:
      'Document type must be one of: lease_agreement, property_photo, inspection_report, receipt, maintenance_record, other',
  })
  documentType?: DocumentFileType;

  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Property ID is required' })
  propertyId: string;

  @IsUUID(4, { message: 'Lease ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Lease ID is required' })
  leaseId?: string;

  @IsEnum(DocumentAccessLevel, {
    message:
      'Access level must be one of: landlord, tenant, both',
  })
  accessLevel?: DocumentAccessLevel;
}
