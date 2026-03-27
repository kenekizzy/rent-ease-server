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
    const clientUrl = process.env.CLIENT_URL;
    
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser && existingUser.role === createUserDto.role) {
        throw new BadRequestException('User with this email already exists');
      }
      const user = await this.usersService.create(createUserDto);
      const session = await this.sessionService.createSession(user);
      const token = await this.sessionService.createVerificationToken(user);

      const verificationLink = `${clientUrl}/verify-email?token=${token.token}`;

      //Pause the email sending service 
      await this.emailService.sendEmailVerification(
         user.email,
         user.firstName,
         verificationLink,
       );

      
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

     await this.emailService.sendWelcomeEmail({
       firstName: user.firstName,
       email: user.email,
     });

    return new VerifyEmailDto('Email verification successful');
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if(user.role !== loginUserDto.role) {
      throw new UnauthorizedException('Invalid role');
    }

    const session = await this.sessionService.createSession(user);
    
    return new AuthResponseDto(
      new UserResponseDto(user),
      session.accessToken,
    );
  }

  async oauthLogin(googleUser: any) {
    if (!googleUser) {
      throw new BadRequestException('Unauthenticated');
    }

    const user = await this.validateGoogleUser(googleUser);

    const session = await this.sessionService.createSession(user);

    return {
      user: new UserResponseDto(user),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken || '',
    };
  }

  async validateGoogleUser(googleData: any): Promise<User> {
    const { email, googleId, firstName, lastName, picture } = googleData;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      if (!existingUser.googleId) {
        // Link Google ID to existing email account
        await this.usersService.update(existingUser.id, {
          googleId,
          avatar: existingUser.avatar || picture,
        });
        return await this.usersService.findOne(existingUser.id);
      }
      return existingUser;
    }

    // Create new user (defaulting to TENANT for safety)
    const newUser = await this.usersService.create({
      email,
      firstName,
      lastName,
      avatar: picture,
      googleId,
      role: 'tenant' as any,
      password: '',
    } as any);

    await this.usersService.update(newUser.id, {
      emailVerified: true,
    });

    await this.emailService.sendWelcomeEmail({
      firstName: newUser.firstName,
      email: newUser.email,
    });

    return await this.usersService.findOne(newUser.id);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !user.password) {
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

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.sessionService.createSession(user);
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
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