import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  Matches,
  IsEnum,
  Min,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyStatus, PropertyType } from '../entities/property.enum';

export class PropertyUnitDto {
  @IsString({ message: 'Unit name must be a string' })
  @IsNotEmpty({ message: 'Unit name is required' })
  name: string;

  @IsOptional()
  @IsNumber({}, { message: 'Rent amount must be a number' })
  @IsPositive({ message: 'Rent amount must be positive' })
  rentAmount?: number;

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
    message: 'Status must be available, occupied, partially_occupied, or maintenance',
  })
  status?: PropertyStatus;
}

export class AdditionalFeesDto {
  @IsOptional()
  @IsNumber({}, { message: 'Service charge must be a number' })
  @Min(0)
  serviceCharge?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Caution fee must be a number' })
  @Min(0)
  cautionFee?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Agency fee must be a number' })
  @Min(0)
  agencyFee?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Legal fee must be a number' })
  @Min(0)
  legalFee?: number;
}

export class UtilitiesDto {
  @IsOptional()
  @IsEnum(['prepaid', 'postpaid', 'none'], { message: 'Electricity must be prepaid, postpaid, or none' })
  electricity?: 'prepaid' | 'postpaid' | 'none';

  @IsOptional()
  @IsEnum(['borehole', 'well', 'none'], { message: 'Water must be borehole, well, or none' })
  water?: 'borehole' | 'well' | 'none';

  @IsOptional()
  @IsBoolean()
  wasteManagement?: boolean;

  @IsOptional()
  @IsBoolean()
  security?: boolean;
}

export class CreatePropertyDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Tenant id must be a string' })
  @IsOptional()
  tenantId?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

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
  @Matches(/^\d{6}(-\d{4})?$/, {
    message: 'ZIP code must be in format 123456 or 123456-7890',
  })
  zipCode: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsEnum(PropertyType, {
    message: 'Invalid property type',
  })
  propertyType: PropertyType;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @IsOptional()
  @IsEnum(['new', 'renovated', 'old'], { message: 'Condition must be new, renovated, or old' })
  condition?: 'new' | 'renovated' | 'old';

  @IsOptional()
  @IsNumber({}, { message: 'Rent amount must be a number' })
  @IsPositive({ message: 'Rent amount must be positive' })
  rentAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rentDurationInMonths?: number;

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
    message: 'Status must be available, occupied, partially_occupied, or maintenance',
  })
  status?: PropertyStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalFeesDto)
  additionalFees?: AdditionalFeesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UtilitiesDto)
  utilities?: UtilitiesDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isListed?: boolean;

  @IsOptional()
  @Type(() => Date)
  publishedAt?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyUnitDto)
  units?: PropertyUnitDto[];
}
