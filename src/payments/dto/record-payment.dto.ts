import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class RecordPaymentDto {
  @IsDateString({}, { message: 'Paid date must be a valid date' })
  @IsNotEmpty({ message: 'Paid date is required' })
  paidDate: string;

  @IsOptional()
  @IsString({ message: 'Payment method must be a string' })
  paymentMethod?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'Status must be pending, paid, or overdue',
  })
  status?: PaymentStatus;
}
