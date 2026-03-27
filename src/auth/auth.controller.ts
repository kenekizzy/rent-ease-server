import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './services/session.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) { }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('token') token: string): Promise<VerifyEmailDto> {
    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginUserDto);
  }

   @Public()
   @Get('google')
   @UseGuards(GoogleAuthGuard)
   async googleAuth() {
      // Initiates Google OAuth flow
   }

   @Public()
   @Get('google/callback')
   @UseGuards(GoogleAuthGuard)
   async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
     const result = await this.authService.oauthLogin(req.user);
      // Redirect to frontend with tokens
     const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
     return res.redirect(redirectUrl);
   }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authHeader: string): Promise<{ message: string }> {
    const token = this.sessionService.extractTokenFromHeader(authHeader);
    if (token) {
      return await this.authService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: User): Promise<AuthResponseDto> {
    return await this.authService.refreshToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateSession(@Headers('authorization') authHeader: string): Promise<{ valid: boolean }> {
    const token = this.sessionService.extractTokenFromHeader(authHeader);
    if (!token) {
      return { valid: false };
    }

    const isValid = await this.authService.validateSession(token);
    return { valid: isValid };
  }
}