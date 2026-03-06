import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto';
import { UpdatePropertyDto } from './dto';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(dto: CreatePropertyDto, req: any): Promise<import("./entities").Property>;
    findAll(req: any): Promise<import("./entities").Property[]>;
    getSummary(req: any): Promise<{
        total: number;
        occupied: number;
        available: number;
        maintenance: number;
        occupancyRate: number;
    }>;
    findOne(id: string, req: any): Promise<import("./entities").Property>;
    update(id: string, dto: UpdatePropertyDto, req: any): Promise<import("./entities").Property>;
    remove(id: string, req: any): Promise<void>;
}
