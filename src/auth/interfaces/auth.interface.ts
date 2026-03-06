import { UserRole } from '../../users/entities/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}