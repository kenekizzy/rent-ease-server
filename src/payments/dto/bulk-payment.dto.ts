import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordPaymentDto } from './record-payment.dto';

export class BulkRecordPaymentDto {
  @IsArray({ message: 'Payment IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one payment ID is required' })
  paymentIds: string[];

  @ValidateNested()
  @Type(() => RecordPaymentDto)
  paymentData: RecordPaymentDto;
}
