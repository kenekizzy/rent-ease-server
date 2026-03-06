import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from './property.entity';
import { Lease } from '../../lease/entities/lease.entity';
export declare enum ComplaintPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum ComplaintStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare class Complaint extends BaseEntity {
    tenantId: string;
    landlordId: string;
    propertyId: string;
    leaseId: string;
    title: string;
    description: string;
    priority: ComplaintPriority;
    status: ComplaintStatus;
    resolutionNotes: string;
    resolvedAt: Date;
    tenant: User;
    landlord: User;
    property: Property;
    lease: Lease;
}
