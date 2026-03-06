import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { Complaint } from './complaint.entity';
import { Document } from '../../files/entities/document.entity';
export declare enum PropertyType {
    APARTMENT = "apartment",
    HOUSE = "house",
    CONDO = "condo",
    STUDIO = "studio",
    TOWNHOUSE = "townhouse",
    COMMERCIAL = "commercial"
}
export declare enum PropertyStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    MAINTENANCE = "maintenance"
}
export declare class Property extends BaseEntity {
    landlordId: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: PropertyType;
    rentAmount: number;
    status: PropertyStatus;
    bedrooms: number;
    bathrooms: number;
    landlord: User;
    leases: Lease[];
    complaints: Complaint[];
    documents: Document[];
}
