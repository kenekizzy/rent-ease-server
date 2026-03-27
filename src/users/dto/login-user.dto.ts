import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsEnum(['landlord', 'tenant'], { message: 'Invalid role' })
  role: 'landlord' | 'tenant';
}
