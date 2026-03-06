"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const authorize_decorator_1 = require("../decorators/authorize.decorator");
let AuthorizationGuard = class AuthorizationGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const authRule = this.reflector.getAllAndOverride(authorize_decorator_1.AUTHORIZATION_KEY, [context.getHandler(), context.getClass()]);
        if (!authRule) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (authRule.roles && authRule.roles.length > 0) {
            const hasRequiredRole = authRule.roles.includes(user.role);
            if (!hasRequiredRole) {
                if (authRule.allowSelf && this.isAccessingSelf(request, user)) {
                    return true;
                }
                throw new common_1.ForbiddenException('Insufficient permissions');
            }
        }
        if (authRule.requireOwnership) {
            if (!this.checkOwnership(request, user)) {
                throw new common_1.ForbiddenException('You can only access your own resources');
            }
        }
        if (authRule.allowSelf && this.isAccessingSelf(request, user)) {
            return true;
        }
        return true;
    }
    isAccessingSelf(request, user) {
        const userId = request.params?.id || request.params?.userId;
        return userId === user.id;
    }
    checkOwnership(request, user) {
        const resourceUserId = request.params?.userId || request.params?.id;
        if (resourceUserId) {
            return resourceUserId === user.id;
        }
        return true;
    }
};
exports.AuthorizationGuard = AuthorizationGuard;
exports.AuthorizationGuard = AuthorizationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AuthorizationGuard);
//# sourceMappingURL=authorization.guard.js.map