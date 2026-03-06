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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let SessionService = class SessionService {
    jwtService;
    configService;
    jwtExpiresIn;
    blacklistedTokens = new Set();
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN') || '24h';
    }
    async createSession(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        const expiresIn = this.getExpirationTime();
        return {
            accessToken,
            expiresIn,
        };
    }
    async createVerificationToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payload);
        const expiresIn = this.getExpirationTime();
        return {
            token,
            expiresIn,
        };
    }
    async validateSession(token) {
        try {
            if (this.blacklistedTokens.has(token)) {
                return false;
            }
            await this.jwtService.verifyAsync(token);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async invalidateSession(token) {
        this.blacklistedTokens.add(token);
    }
    async refreshSession(user) {
        return await this.createSession(user);
    }
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
    createAuthenticatedUser(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
    getExpirationTime() {
        const expiresIn = this.jwtExpiresIn;
        if (expiresIn.endsWith('h')) {
            return parseInt(expiresIn.slice(0, -1)) * 3600;
        }
        else if (expiresIn.endsWith('d')) {
            return parseInt(expiresIn.slice(0, -1)) * 86400;
        }
        else if (expiresIn.endsWith('m')) {
            return parseInt(expiresIn.slice(0, -1)) * 60;
        }
        return 86400;
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], SessionService);
//# sourceMappingURL=session.service.js.map