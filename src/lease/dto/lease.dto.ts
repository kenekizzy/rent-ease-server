import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { LeaseStatus } from '../entities/lease.entity';

export class InviteLeaseDto {
  @IsUUID()
  propertyId: string;

  @IsEmail()
  tenantEmail: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  annualRent: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  securityDeposit: number;

  @IsOptional()
  @IsDateString()
  annualDueDate?: string;

  @IsOptional()
  @IsString()
  termsText?: string;
}

export class AcceptInviteDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class CreateLeaseDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  tenantId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  annualRent: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  securityDeposit: number;

  @IsOptional()
  @IsDateString()
  annualDueDate?: string;

  @IsOptional()
  @IsString()
  termsText?: string;
}

export class UpdateLeaseDto {
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  annualRent?: number;

  @IsOptional()
  @IsDateString()
  annualDueDate?: string;

  @IsOptional()
  @IsEnum(LeaseStatus)
  status?: LeaseStatus;

  @IsOptional()
  @IsString()
  termsText?: string;
}

export class TerminateLeaseDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}