import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SessionService } from './services/session.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '24h';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
          signOptions: {
            expiresIn: expiresIn as any, // Type assertion to handle string type
          },
        };
      },
      inject: [ConfigService],
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    GoogleStrategy,
    GoogleAuthGuard,
    RolesGuard,
    AuthorizationGuard,
  ],
  exports: [
    AuthService,
    SessionService,
    JwtAuthGuard,
    RolesGuard,
    AuthorizationGuard,
  ],
})
export class AuthModule {}