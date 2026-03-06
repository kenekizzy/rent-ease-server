import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Matches, MinLength, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  avatar?: string;

  @IsOptional()
  @IsBoolean({ message: 'Email verification must be a boolean' })
  emailVerified?: boolean;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[\d\s\-()]+$/, {
    message: 'Please provide a valid phone number',
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  password?: string;
}
