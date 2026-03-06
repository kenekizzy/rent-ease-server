import { BaseEntity } from '../../common/entities/base.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { User } from '../../users/entities/user.entity';
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    OVERDUE = "overdue",
    PARTIAL = "partial",
    WAIVED = "waived"
}
export declare enum PaymentMethod {
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash",
    CHECK = "check",
    CARD = "card",
    ONLINE = "online"
}
export declare class Payment extends BaseEntity {
    leaseId: string;
    tenantId: string;
    landlordId: string;
    amount: number;
    dueDate: Date;
    paidDate: Date;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    transactionRef: string;
    transactionDocument: string;
    periodYear: number;
    amountPaid: number;
    notes: string;
    lease: Lease;
    tenant: User;
    landlord: User;
}
