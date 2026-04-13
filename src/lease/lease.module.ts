import { Module } from '@nestjs/common';
import { LeaseService } from './lease.service';
import { LeaseController } from './lease.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lease } from './entities/lease.entity';
import { AuthModule } from '../auth';
import { PropertiesModule } from '../properties/properties.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '../mailer/mailer.module';
import { PropertyUnit } from '../properties/entities/property-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lease, PropertyUnit]), AuthModule, PropertiesModule, NotificationsModule, UsersModule, MailerModule],
  controllers: [LeaseController],
  providers: [LeaseService],
  exports: [LeaseService],
})
export class LeaseModule { }

