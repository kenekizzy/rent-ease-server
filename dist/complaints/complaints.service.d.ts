import { Repository } from 'typeorm';
import { Complaint } from './entities/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Lease } from '../lease/entities/lease.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ComplaintsService {
    private readonly complaintRepository;
    private readonly leaseRepository;
    private readonly notificationsService;
    constructor(complaintRepository: Repository<Complaint>, leaseRepository: Repository<Lease>, notificationsService: NotificationsService);
    create(tenantId: string, dto: CreateComplaintDto): Promise<Complaint>;
    findAll(userId: string, role: 'landlord' | 'tenant'): Promise<Complaint[]>;
    findOne(id: string, userId: string): Promise<Complaint>;
    update(id: string, userId: string, dto: UpdateComplaintDto): Promise<Complaint>;
}
