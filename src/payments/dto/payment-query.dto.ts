import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DateRangeDto } from '../../common/dto/date-range.dto';

export class PaymentQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'Status must be pending, paid, or overdue',
  })
  status?: PaymentStatus;

  @IsOptional()
  @IsUUID(4, { message: 'Lease ID must be a valid UUID' })
  leaseId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  propertyId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Tenant ID must be a valid UUID' })
  tenantId?: string;
}

export class PaymentReportQueryDto extends DateRangeDto {
  @IsOptional()
  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  propertyId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Landlord ID must be a valid UUID' })
  landlordId?: string;
}
