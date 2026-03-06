import { IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class NotificationQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(NotificationType, {
    message:
      'Type must be one of: complaint_submitted, complaint_status_updated, rent_due, payment_received, payment_overdue, rent_increase, lease_expiring, document_uploaded',
  })
  type?: NotificationType;

  @IsOptional()
  @IsBoolean({ message: 'Read status must be a boolean' })
  read?: boolean;

  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId?: string;
}
