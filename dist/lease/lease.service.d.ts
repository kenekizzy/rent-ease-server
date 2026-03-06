import { Repository } from 'typeorm';
import { Lease } from './entities/lease.entity';
import { CreateLeaseDto, UpdateLeaseDto, TerminateLeaseDto } from './dto/lease.dto';
import { UsersService } from 'src/users/users.service';
import { PropertiesService } from 'src/properties/properties.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class LeaseService {
    private readonly leaseRepository;
    private readonly usersService;
    private readonly propertiesService;
    private readonly notificationsService;
    constructor(leaseRepository: Repository<Lease>, usersService: UsersService, propertiesService: PropertiesService, notificationsService: NotificationsService);
    create(landlordId: string, dto: CreateLeaseDto): Promise<Lease>;
    findAllForLandlord(landlordId: string): Promise<Lease[]>;
    findAllForTenant(tenantId: string): Promise<Lease[]>;
    findOne(id: string, userId: string): Promise<Lease>;
    update(id: string, landlordId: string, dto: UpdateLeaseDto): Promise<Lease>;
    terminate(id: string, landlordId: string, dto: TerminateLeaseDto): Promise<Lease>;
    findById(id: string): Promise<Lease>;
    private assertExists;
    private assertParticipant;
}
