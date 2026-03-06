import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException,
  UnauthorizedException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTHORIZATION_KEY, AuthorizationRule } from '../decorators/authorize.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const authRule = this.reflector.getAllAndOverride<AuthorizationRule>(
      AUTHORIZATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!authRule) {
      return true; // No authorization rule specified
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check role-based access
    if (authRule.roles && authRule.roles.length > 0) {
      const hasRequiredRole = authRule.roles.includes(user.role);
      
      if (!hasRequiredRole) {
        // If allowSelf is true, check if user is accessing their own resource
        if (authRule.allowSelf && this.isAccessingSelf(request, user)) {
          return true;
        }
        
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    // Check ownership requirement
    if (authRule.requireOwnership) {
      if (!this.checkOwnership(request, user)) {
        throw new ForbiddenException('You can only access your own resources');
      }
    }

    // Check self-access
    if (authRule.allowSelf && this.isAccessingSelf(request, user)) {
      return true;
    }

    return true;
  }

  private isAccessingSelf(request: any, user: any): boolean {
    const userId = request.params?.id || request.params?.userId;
    return userId === user.id;
  }

  private checkOwnership(request: any, user: any): boolean {
    // This is a basic implementation. In a real application,
    // you might need to query the database to verify ownership
    const resourceUserId = request.params?.userId || request.params?.id;
    
    if (resourceUserId) {
      return resourceUserId === user.id;
    }

    // For resources that don't have a direct user ID in the URL,
    // you might need to implement custom logic or use a service
    // to check ownership based on the resource type
    return true;
  }
}