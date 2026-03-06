import { BaseEntity } from '../../common/entities/base.entity';
import { Property } from '../../properties/entities/property.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { User } from '../../users/entities/user.entity';
export declare enum DocumentFileType {
    PDF = "pdf",
    IMAGE = "image",
    TEXT = "text",
    SPREADSHEET = "spreadsheet",
    OTHER = "other"
}
export declare enum DocumentAccessLevel {
    LANDLORD = "landlord",
    TENANT = "tenant",
    BOTH = "both"
}
export declare class Document extends BaseEntity {
    uploadedById: string;
    leaseId: string;
    propertyId: string;
    fileName: string;
    filePath: string;
    fileType: DocumentFileType;
    mimeType: string;
    fileSizeKb: number;
    version: number;
    accessLevel: DocumentAccessLevel;
    uploadedBy: User;
    lease: Lease;
    property: Property;
}
