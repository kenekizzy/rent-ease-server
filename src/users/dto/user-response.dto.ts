import { Exclude } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
