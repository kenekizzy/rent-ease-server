import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentSchedulerService } from './payment-scheduler.service';
import { Payment } from './entities/payment.entity';
import { Lease } from '../lease/entities/lease.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, Lease]),
        NotificationsModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentSchedulerService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
