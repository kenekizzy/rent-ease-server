import { IsOptional, IsDateString } from 'class-validator';
import { IsAfterDate } from '../validators/date-range.validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsAfterDate('startDate', { message: 'End date must be after start date' })
  endDate?: string;
}
