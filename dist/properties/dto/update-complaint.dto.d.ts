import { CreateComplaintDto } from './create-complaint.dto';
import { ComplaintStatus } from '../entities/complaint.entity';
declare const UpdateComplaintDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateComplaintDto>>;
export declare class UpdateComplaintDto extends UpdateComplaintDto_base {
    status?: ComplaintStatus;
}
export {};
