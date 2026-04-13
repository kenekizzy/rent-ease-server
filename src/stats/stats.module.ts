import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Property } from '../properties/entities/property.entity';
import { Lease } from '../lease/entities/lease.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Complaint } from '../complaints/entities/complaint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Lease, Payment, Complaint]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
