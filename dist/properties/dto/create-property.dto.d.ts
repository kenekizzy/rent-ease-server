import { PropertyStatus, PropertyType } from '../entities/property.entity';
export declare class CreatePropertyDto {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: PropertyType;
    rentAmount: number;
    bedrooms?: number;
    bathrooms?: number;
    status?: PropertyStatus;
}
