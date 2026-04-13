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
  IsDate,
} from 'class-validator';
import { LeaseStatus } from '../entities/lease.entity';
import { Transform, Type } from 'class-transformer';

export class InviteLeaseDto {
  @IsUUID()
  propertyId: string;

  @IsEmail()
  tenantEmail: string;

  @IsOptional()
  @IsUUID()
  unitId?: string;

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

  @IsOptional()
  @IsUUID()
  unitId?: string;

  @IsOptional()
  @IsEmail()
  tenantEmail?: string;

  @IsOptional()
  @IsString()
  inviteToken?: string;

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

  @IsOptional()
  @IsEnum(LeaseStatus)
  status?: LeaseStatus;

  @IsOptional()
  @Transform(({ value }) => value?.value ?? value)
  @Type(() => Date)
  @IsDate()
  acceptedAt?: Date;
  
  @IsOptional()
  @Transform(({ value }) => value?.value ?? value)
  @Type(() => Date)
  @IsDate()
  terminatedAt?: Date;
   
  @IsOptional()
  @IsString()
  terminationReason?: string;
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