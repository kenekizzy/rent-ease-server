import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import {
  ComplaintStatus,
  ComplaintPriority,
} from '../entities/complaint.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ComplaintQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ComplaintStatus, {
    message: 'Status must be open, in_progress, resolved, or closed',
  })
  status?: ComplaintStatus;

  @IsOptional()
  @IsEnum(ComplaintPriority, {
    message: 'Priority must be low, medium, high, or urgent',
  })
  priority?: ComplaintPriority;

  @IsOptional()
  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  propertyId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Tenant ID must be a valid UUID' })
  tenantId?: string;
}
