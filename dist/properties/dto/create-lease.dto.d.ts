import { LeaseStatus } from '../../lease/entities/lease.entity';
export declare class CreateLeaseDto {
    startDate: string;
    endDate: string;
    rentAmount: number;
    securityDeposit: number;
    propertyId: string;
    tenantId: string;
    status?: LeaseStatus;
}
