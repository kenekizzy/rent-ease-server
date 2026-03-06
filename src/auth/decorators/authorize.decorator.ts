import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export interface AuthorizationRule {
  roles?: UserRole[];
  requireOwnership?: boolean;
  allowSelf?: boolean;
}

export const AUTHORIZATION_KEY = 'authorization';

export const Authorize = (rule: AuthorizationRule) => 
  SetMetadata(AUTHORIZATION_KEY, rule);

// Convenience decorators for common patterns
export const RequireRoles = (...roles: UserRole[]) => 
  Authorize({ roles });

export const RequireOwnership = () => 
  Authorize({ requireOwnership: true });

export const AllowSelfOrRoles = (...roles: UserRole[]) => 
  Authorize({ roles, allowSelf: true });

export const LandlordsOnly = () => 
  Authorize({ roles: [UserRole.LANDLORD] });

export const TenantsOnly = () => 
  Authorize({ roles: [UserRole.TENANT] });