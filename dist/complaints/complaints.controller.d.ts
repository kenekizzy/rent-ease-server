import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    create(req: any, dto: CreateComplaintDto): Promise<import("./entities/complaint.entity").Complaint>;
    findAll(req: any): Promise<import("./entities/complaint.entity").Complaint[]>;
    findOne(id: string, req: any): Promise<import("./entities/complaint.entity").Complaint>;
    update(id: string, req: any, dto: UpdateComplaintDto): Promise<import("./entities/complaint.entity").Complaint>;
}
