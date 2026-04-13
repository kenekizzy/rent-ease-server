import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  complaintAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  paymentAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  rentReminders?: boolean;

  @IsBoolean()
  @IsOptional()
  documentAlerts?: boolean;

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  reminderDaysBefore?: number;
}
