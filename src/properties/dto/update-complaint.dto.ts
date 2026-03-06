import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateComplaintDto } from './create-complaint.dto';
import { ComplaintStatus } from '../entities/complaint.entity';

export class UpdateComplaintDto extends PartialType(CreateComplaintDto) {
  @IsOptional()
  @IsEnum(ComplaintStatus, {
    message: 'Status must be open, in_progress, resolved, or closed',
  })
  status?: ComplaintStatus;
}
