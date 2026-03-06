import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyStatus } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertiesService {
    private readonly propertyRepository;
    constructor(propertyRepository: Repository<Property>);
    create(landlordId: string, dto: CreatePropertyDto): Promise<Property>;
    findAll(landlordId: string): Promise<Property[]>;
    findOne(id: string, landlordId: string): Promise<Property>;
    update(id: string, landlordId: string, dto: UpdatePropertyDto): Promise<Property>;
    remove(id: string, landlordId: string): Promise<void>;
    getOccupancySummary(landlordId: string): Promise<{
        total: number;
        occupied: number;
        available: number;
        maintenance: number;
        occupancyRate: number;
    }>;
    findById(id: string): Promise<Property>;
    setStatus(id: string, status: PropertyStatus): Promise<void>;
    private assertExists;
    private assertOwner;
}
