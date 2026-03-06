import { PaymentMethod } from '../entities/payment.entity';
export declare class RecordPaymentDto {
    paidDate: string;
    paymentMethod: PaymentMethod;
    transactionRef?: string;
    amountPaid?: number;
    notes?: string;
}
