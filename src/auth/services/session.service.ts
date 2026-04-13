import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { JwtPayload, AuthenticatedUser } from '../interfaces/auth.interface';

@Injectable()
export class SessionService {
  private readonly jwtExpiresIn: string;
  private readonly blacklistedTokens = new Set<string>(); // In production, use Redis
  private readonly resetTokens = new Map<string, { userId: string; email: string; expiresAt: Date }>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
  }

  async createSession(user: User): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    const expiresIn = this.getExpirationTime();

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async createVerificationToken(user: User): Promise<{ token: string; expiresIn: number }> {
    const payload: JwtPayload = {
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

  async validateVerificationToken(token: string): Promise<JwtPayload> {
    if (!token) {
      throw new UnauthorizedException('Verification token is required');
    }

    if (this.blacklistedTokens.has(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    const decodedToken = await this.jwtService.verifyAsync(token);

    return decodedToken;
  }

  async validateSession(token: string): Promise<boolean> {
    try {
      // Check if token is blacklisted
      if (this.blacklistedTokens.has(token)) {
        return false;
      }

      // Verify token signature and expiration
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async invalidateSession(token: string): Promise<void> {
    // Add token to blacklist
    this.blacklistedTokens.add(token);

    // In production, you would store this in Redis with TTL
    // matching the token's remaining lifetime
  }

  async refreshSession(user: User): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    return await this.createSession(user);
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  createAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  createResetToken(userId: string, email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    this.resetTokens.set(token, { userId, email, expiresAt });
    return token;
  }

  validateResetToken(token: string): { userId: string; email: string } {
    const entry = this.resetTokens.get(token);
    if (!entry) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (entry.expiresAt < new Date()) {
      this.resetTokens.delete(token);
      throw new BadRequestException('Invalid or expired reset token');
    }
    this.resetTokens.delete(token);
    return { userId: entry.userId, email: entry.email };
  }

  private getExpirationTime(): number {
    // Convert JWT expiration string to seconds
    const expiresIn = this.jwtExpiresIn;
    if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn.slice(0, -1)) * 3600;
    } else if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn.slice(0, -1)) * 86400;
    } else if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn.slice(0, -1)) * 60;
    }
    return 86400; // Default to 24 hours
  }
}