import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import {
  ComplaintPriority,
  ComplaintStatus,
} from '../entities/complaint.entity';

export class CreateComplaintDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsOptional()
  @IsEnum(ComplaintPriority, {
    message: 'Priority must be low, medium, high, or urgent',
  })
  priority?: ComplaintPriority;

  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Property ID is required' })
  propertyId: string;

  @IsOptional()
  @IsEnum(ComplaintStatus, {
    message: 'Status must be open, in_progress, resolved, or closed',
  })
  status?: ComplaintStatus;
}
