import { PropertyStatus } from '../entities/property.entity';
export declare class CreatePropertyDto {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    rentAmount: number;
    description?: string;
    status?: PropertyStatus;
}
