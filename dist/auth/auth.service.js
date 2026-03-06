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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const session_service_1 = require("./services/session.service");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const dto_1 = require("./dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const config_1 = require("@nestjs/config");
const mailer_service_1 = require("../mailer/mailer.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    sessionService;
    configService;
    emailService;
    constructor(usersService, jwtService, sessionService, configService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sessionService = sessionService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async register(createUserDto) {
        const clientUrl = this.configService.get('CLIENT_URL');
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser && existingUser.role === createUserDto.role) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const user = await this.usersService.create(createUserDto);
        const session = await this.sessionService.createSession(user);
        const token = await this.sessionService.createVerificationToken(user);
        const verificationLink = `${clientUrl}/verify-me/token=${token.token}`;
        console.log("Verification Link: ", verificationLink);
        return new auth_response_dto_1.AuthResponseDto(new user_response_dto_1.UserResponseDto(user));
    }
    async verifyEmail(token) {
        const decodedToken = await this.jwtService.verifyAsync(token);
        const user = await this.usersService.findByEmail(decodedToken.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        await this.usersService.update(user.id.toString(), {
            emailVerified: true,
        });
        return new dto_1.VerifyEmailDto('Email verification successful');
    }
    async login(loginUserDto) {
        const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const session = await this.sessionService.createSession(user);
        return new auth_response_dto_1.AuthResponseDto(new user_response_dto_1.UserResponseDto(user), session.accessToken);
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.usersService.validatePassword(user, password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async validateUserById(userId) {
        try {
            return await this.usersService.findOne(userId);
        }
        catch (error) {
            return null;
        }
    }
    async generateTokens(user) {
        const session = await this.sessionService.createSession(user);
        return {
            accessToken: session.accessToken,
        };
    }
    async logout(token) {
        await this.sessionService.invalidateSession(token);
        return { message: 'Logged out successfully' };
    }
    async refreshToken(user) {
        const session = await this.sessionService.refreshSession(user);
        return new auth_response_dto_1.AuthResponseDto(new user_response_dto_1.UserResponseDto(user), session.accessToken);
    }
    async validateSession(token) {
        return await this.sessionService.validateSession(token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        session_service_1.SessionService,
        config_1.ConfigService,
        mailer_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map