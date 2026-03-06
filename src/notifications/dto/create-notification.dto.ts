import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message is required' })
  message: string;

  @IsEnum(NotificationType, {
    message:
      'Type must be one of: complaint_submitted, complaint_status_updated, rent_due, payment_received, payment_overdue, rent_increase, lease_expiring, document_uploaded',
  })
  type: NotificationType;

  @IsOptional()
  @IsBoolean({ message: 'Read status must be a boolean' })
  read?: boolean;

  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsOptional()
  @IsUUID(4, { message: 'Reference ID must be a valid UUID' })
  referenceId?: string;

  @IsOptional()
  @IsString({ message: 'Reference type must be a string' })
  referenceType?: string;
}
