import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentSchedulerService {
  private readonly logger = new Logger(PaymentSchedulerService.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Cron('5 0 1 1 *') // 00:05 UTC on Jan 1
  async handleYearlyPayments() {
    try {
      await this.paymentsService.generateYearlyPayments();
    } catch (err) {
      this.logger.error('Yearly payment generation failed', err);
    }
  }
}
