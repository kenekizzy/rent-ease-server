import {
  IsNumber,
  IsPositive,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  amount: number;

  @IsDateString({}, { message: 'Due date must be a valid date' })
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'Paid date must be a valid date' })
  paidDate?: string;

  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'Status must be pending, paid, or overdue',
  })
  status?: PaymentStatus;

  @IsOptional()
  @IsString({ message: 'Payment method must be a string' })
  paymentMethod?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsUUID(4, { message: 'Lease ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Lease ID is required' })
  leaseId: string;
}
