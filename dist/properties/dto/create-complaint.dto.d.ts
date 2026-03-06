import { ComplaintPriority, ComplaintStatus } from '../entities/complaint.entity';
export declare class CreateComplaintDto {
    title: string;
    description: string;
    priority?: ComplaintPriority;
    propertyId: string;
    status?: ComplaintStatus;
}
