import { IsArray, IsUUID, ArrayMinSize, IsOptional } from 'class-validator';

export class MarkNotificationsReadDto {
  @IsOptional()
  @IsArray({ message: 'Notification IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one notification ID is required' })
  @IsUUID(4, {
    each: true,
    message: 'Each notification ID must be a valid UUID',
  })
  notificationIds?: string[];
}
