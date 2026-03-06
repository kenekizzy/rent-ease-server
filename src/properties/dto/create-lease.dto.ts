import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { LeaseStatus } from '../../lease/entities/lease.entity';
import { IsAfterDate } from '../../common/validators/date-range.validator';

export class CreateLeaseDto {
  @IsDateString({}, { message: 'Start date must be a valid date' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsNotEmpty({ message: 'End date is required' })
  @IsAfterDate('startDate', { message: 'End date must be after start date' })
  endDate: string;

  @IsNumber({}, { message: 'Rent amount must be a number' })
  @IsPositive({ message: 'Rent amount must be positive' })
  rentAmount: number;

  @IsNumber({}, { message: 'Security deposit must be a number' })
  @IsPositive({ message: 'Security deposit must be positive' })
  securityDeposit: number;

  @IsUUID(4, { message: 'Property ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Property ID is required' })
  propertyId: string;

  @IsUUID(4, { message: 'Tenant ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Tenant ID is required' })
  tenantId: string;

  @IsOptional()
  @IsEnum(LeaseStatus, {
    message: 'Status must be active, expired, or terminated',
  })
  status?: LeaseStatus;
}
