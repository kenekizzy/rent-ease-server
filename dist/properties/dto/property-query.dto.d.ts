import { PropertyStatus } from '../entities/property.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class PropertyQueryDto extends PaginationDto {
    status?: PropertyStatus;
    city?: string;
    state?: string;
    landlordId?: string;
}
