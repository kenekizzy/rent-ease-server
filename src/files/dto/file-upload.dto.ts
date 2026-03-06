import { IsEnum, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { DocumentFileType } from '../entities/document.entity';

export class FileUploadDto {
  @IsOptional()
  @IsEnum(DocumentFileType, {
    message:
      'Document type must be one of: lease_agreement, property_photo, inspection_report, receipt, maintenance_record, other',
  })
  documentType?: DocumentFileType;

  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Property ID is required' })
  propertyId: string;
}
