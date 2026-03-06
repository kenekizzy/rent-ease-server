import { NotificationType } from '../entities/notification.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class NotificationQueryDto extends PaginationDto {
    type?: NotificationType;
    read?: boolean;
    userId?: string;
}
