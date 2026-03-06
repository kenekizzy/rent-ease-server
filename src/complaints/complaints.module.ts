import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { Lease } from '../lease/entities/lease.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, Lease]),
    NotificationsModule,
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule { }
