import { Module } from '@nestjs/common';
import { LeaseService } from './lease.service';
import { LeaseController } from './lease.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lease } from './entities/lease.entity';
import { AuthModule } from 'src/auth';
import { PropertiesModule } from 'src/properties/properties.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lease]), AuthModule, PropertiesModule, NotificationsModule, UsersModule, MailerModule],
  controllers: [LeaseController],
  providers: [LeaseService],
  exports: [LeaseService],
})
export class LeaseModule { }

