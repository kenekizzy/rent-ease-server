import { UserRole } from '../../users/entities/user.entity';
export interface AuthorizationRule {
    roles?: UserRole[];
    requireOwnership?: boolean;
    allowSelf?: boolean;
}
export declare const AUTHORIZATION_KEY = "authorization";
export declare const Authorize: (rule: AuthorizationRule) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireRoles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireOwnership: () => import("@nestjs/common").CustomDecorator<string>;
export declare const AllowSelfOrRoles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const LandlordsOnly: () => import("@nestjs/common").CustomDecorator<string>;
export declare const TenantsOnly: () => import("@nestjs/common").CustomDecorator<string>;
