import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Document } from '../../files/entities/document.entity';
export declare enum LeaseStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    TERMINATED = "terminated"
}
export declare class Lease extends BaseEntity {
    propertyId: string;
    tenantId: string;
    landlordId: string;
    startDate: Date;
    endDate: Date;
    annualRent: number;
    securityDeposit: number;
    annualDueDate: Date;
    status: LeaseStatus;
    termsText: string;
    property: Property;
    tenant: User;
    landlord: User;
    payments: Payment[];
    complaints: Complaint[];
    documents: Document[];
}
