import { LeaseStatus } from '../entities/lease.entity';
export declare class CreateLeaseDto {
    propertyId: string;
    tenantId: string;
    startDate: string;
    endDate: string;
    annualRent: number;
    securityDeposit: number;
    annualDueDate?: string;
    termsText?: string;
}
export declare class UpdateLeaseDto {
    endDate?: string;
    annualRent?: number;
    annualDueDate?: string;
    status?: LeaseStatus;
    termsText?: string;
}
export declare class TerminateLeaseDto {
    reason: string;
}
