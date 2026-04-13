import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class SubmitProofDto {
  @IsDateString({}, { message: 'Paid date must be a valid date' })
  @IsNotEmpty({ message: 'Paid date is required' })
  paidDate: string;

  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  @IsNotEmpty({ message: 'Payment method is required' })
  paymentMethod: PaymentMethod;

  @IsString({ message: 'Transaction reference is required' })
  @IsNotEmpty({ message: 'Transaction reference is required' })
  transactionRef: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsOptional()
  @IsString({ message: 'Document URL must be a string' })
  transactionDocument?: string;
}
