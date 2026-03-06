import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { AuthenticatedUser } from '../interfaces/auth.interface';
export declare class SessionService {
    private readonly jwtService;
    private readonly configService;
    private readonly jwtExpiresIn;
    private readonly blacklistedTokens;
    constructor(jwtService: JwtService, configService: ConfigService);
    createSession(user: User): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    createVerificationToken(user: User): Promise<{
        token: string;
        expiresIn: number;
    }>;
    validateSession(token: string): Promise<boolean>;
    invalidateSession(token: string): Promise<void>;
    refreshSession(user: User): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    extractTokenFromHeader(authHeader: string): string | null;
    createAuthenticatedUser(user: User): AuthenticatedUser;
    private getExpirationTime;
}
