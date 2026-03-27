import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Import entities
import { User } from './users/entities/user.entity';
import { Property } from './properties/entities/property.entity';
import { Lease } from './lease/entities/lease.entity';
import { Payment } from './payments/entities/payment.entity';
import { Complaint } from './complaints/entities/complaint.entity';
import { AppNotification } from './notifications/entities/notification.entity';
import { NotificationPreference } from './notifications/entities/notification-preferences.entity';
import { Document } from './files/entities/document.entity';
import { MailerModule } from './mailer/mailer.module';
import { FilesModule } from './files/files.module';
import { PropertiesModule } from './properties/properties.module';
import { LeaseModule } from './lease/lease.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development.local`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        entities: [
          User,
          Property,
          Lease,
          Payment,
          Complaint,
          AppNotification,
          NotificationPreference,
          Document,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MailerModule,
    FilesModule,
    PropertiesModule,
    LeaseModule,
    ComplaintsModule,
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
