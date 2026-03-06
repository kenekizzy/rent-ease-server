import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  Matches,
  IsEnum,
  Min,
} from 'class-validator';
import { PropertyStatus, PropertyType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  addressLine1: string;

  @IsOptional()
  @IsString({ message: 'Address line 2 must be a string' })
  addressLine2?: string;

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

  @IsEnum(PropertyType, {
    message: 'Invalid property type',
  })
  propertyType: PropertyType;

  @IsNumber({}, { message: 'Rent amount must be a number' })
  @IsPositive({ message: 'Rent amount must be positive' })
  rentAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsEnum(PropertyStatus, {
    message: 'Status must be available, occupied, or maintenance',
  })
  status?: PropertyStatus;
}
