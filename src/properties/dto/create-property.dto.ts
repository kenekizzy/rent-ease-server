import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { PropertyStatus } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsString({ message: 'State must be a string' })
  @IsNotEmpty({ message: 'State is required' })
  state: string;

  @IsString({ message: 'ZIP code must be a string' })
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'ZIP code must be in format 12345 or 12345-6789',
  })
  zipCode: string;

  @IsNumber({}, { message: 'Rent amount must be a number' })
  @IsPositive({ message: 'Rent amount must be positive' })
  rentAmount: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(PropertyStatus, {
    message: 'Status must be available, occupied, or maintenance',
  })
  status?: PropertyStatus;
}
