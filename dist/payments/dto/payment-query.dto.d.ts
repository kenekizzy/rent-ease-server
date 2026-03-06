import { PaymentStatus } from '../entities/payment.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DateRangeDto } from '../../common/dto/date-range.dto';
export declare class PaymentQueryDto extends PaginationDto {
    status?: PaymentStatus;
    leaseId?: string;
    propertyId?: string;
    tenantId?: string;
}
export declare class PaymentReportQueryDto extends DateRangeDto {
    propertyId?: string;
    landlordId?: string;
}
