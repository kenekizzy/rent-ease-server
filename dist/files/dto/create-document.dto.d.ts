import { DocumentFileType, DocumentAccessLevel } from '../entities/document.entity';
export declare class CreateDocumentDto {
    filename: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    documentType?: DocumentFileType;
    propertyId: string;
    leaseId?: string;
    accessLevel?: DocumentAccessLevel;
}
