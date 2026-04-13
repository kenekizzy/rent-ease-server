import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { Lease } from '../lease/entities/lease.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Complaint } from '../complaints/entities/complaint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lease, Payment, Complaint]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
