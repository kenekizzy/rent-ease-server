import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Match } from '../../common/validators/match.validator';

export class ChangePasswordDto {
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsString({ message: 'New password must be a string' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'New password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  newPassword: string;

  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('newPassword', { message: 'Confirm password must match new password' })
  confirmPassword: string;
}
