import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class RecordPaymentDto {
  @IsDateString({}, { message: 'Paid date must be a valid date' })
  @IsNotEmpty({ message: 'Paid date is required' })
  paidDate: string;

  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  @IsNotEmpty({ message: 'Payment method is required' })
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString({ message: 'Transaction reference must be a string' })
  transactionRef?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amountPaid?: number;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
