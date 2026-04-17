import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
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
import { PropertyUnit } from './properties/entities/property-unit.entity';
import { Document } from './files/entities/document.entity';
import { MailerModule } from './mailer/mailer.module';
import { FilesModule } from './files/files.module';
import { PropertiesModule } from './properties/properties.module';
import { LeaseModule } from './lease/lease.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { StatsModule } from './stats/stats.module';
import { ActivitiesModule } from './activities/activities.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.development.prod' : '.env.development.local',
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
          PropertyUnit,
        ],
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MailerModule,
    FilesModule,
    PropertiesModule,
    LeaseModule,
    ComplaintsModule,
    NotificationsModule,
    PaymentsModule,
    StatsModule,
    ActivitiesModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
