import { AuthService } from './auth.service';
import { SessionService } from './services/session.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly sessionService;
    constructor(authService: AuthService, sessionService: SessionService);
    register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    verifyEmail(token: string): Promise<VerifyEmailDto>;
    login(loginUserDto: LoginUserDto): Promise<AuthResponseDto>;
    logout(authHeader: string): Promise<{
        message: string;
    }>;
    refresh(user: User): Promise<AuthResponseDto>;
    validateSession(authHeader: string): Promise<{
        valid: boolean;
    }>;
}
