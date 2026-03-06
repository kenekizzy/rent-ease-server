import { ComplaintStatus, ComplaintPriority } from '../entities/complaint.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ComplaintQueryDto extends PaginationDto {
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    propertyId?: string;
    tenantId?: string;
}
