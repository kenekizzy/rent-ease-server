import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionService } from './services/session.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { VerifyEmailDto } from './dto';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/mailer/mailer.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly sessionService;
    private readonly configService;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, sessionService: SessionService, configService: ConfigService, emailService: EmailService);
    register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    verifyEmail(token: string): Promise<VerifyEmailDto>;
    login(loginUserDto: LoginUserDto): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<User | null>;
    validateUserById(userId: string): Promise<User | null>;
    generateTokens(user: User): Promise<{
        accessToken: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    refreshToken(user: User): Promise<AuthResponseDto>;
    validateSession(token: string): Promise<boolean>;
}
