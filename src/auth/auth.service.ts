import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionService } from './services/session.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto} from './dto/auth-response.dto';
import { VerifyEmailDto } from './dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/mailer/mailer.service';
import { JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser && existingUser.role === createUserDto.role) {
        throw new BadRequestException('User with this email already exists');
      }
      const user = await this.usersService.create(createUserDto);
      const session = await this.sessionService.createSession(user);
      const token = await this.sessionService.createVerificationToken(user);

      const verificationLink = `${clientUrl}/verify-me/token=${token.token}`;
      console.log("Verification Link: ", verificationLink);

      // Pause the email sending for now
      // await this.emailService.sendEmailVerification(
      //   user.email,
      //   user.firstName,
      //   verificationLink,
      // );

      
      return new AuthResponseDto(
        new UserResponseDto(user)
      );
  }

  async verifyEmail(token: string): Promise<VerifyEmailDto> {
    const decodedToken = await this.sessionService.validateVerificationToken(token);

    const user = await this.usersService.findByEmail(decodedToken.email);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.usersService.update(user.id.toString(), {
      emailVerified: true,
    });

    // await this.emailService.sendWelcomeEmail({
    //   firstName: user.firstName,
    //   email: user.email,
    // });

    return new VerifyEmailDto('Email verification successful');
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const session = await this.sessionService.createSession(user);
    
    return new AuthResponseDto(
      new UserResponseDto(user),
      session.accessToken,
    );
  }

  async validateUser(email: string, password: string): Promise<User | null> {
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

  async validateUserById(userId: string): Promise<User | null> {
    try {
      return await this.usersService.findOne(userId);
    } catch (error) {
      return null;
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string }> {
    const session = await this.sessionService.createSession(user);
    return {
      accessToken: session.accessToken,
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    // Invalidate the session
    await this.sessionService.invalidateSession(token);
    return { message: 'Logged out successfully' };
  }

  async refreshToken(user: User): Promise<AuthResponseDto> {
    const session = await this.sessionService.refreshSession(user);
    
    return new AuthResponseDto(
      new UserResponseDto(user),
      session.accessToken,
    );
  }

  async validateSession(token: string): Promise<boolean> {
    return await this.sessionService.validateSession(token);
  }
}