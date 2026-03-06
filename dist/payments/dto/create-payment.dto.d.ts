import { PaymentStatus } from '../entities/payment.entity';
export declare class CreatePaymentDto {
    amount: number;
    dueDate: string;
    paidDate?: string;
    status?: PaymentStatus;
    paymentMethod?: string;
    notes?: string;
    leaseId: string;
}
