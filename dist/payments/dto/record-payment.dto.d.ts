import { PaymentStatus } from '../entities/payment.entity';
export declare class RecordPaymentDto {
    paidDate: string;
    paymentMethod?: string;
    notes?: string;
    status?: PaymentStatus;
}
