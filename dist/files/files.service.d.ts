import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto';
export declare class FilesService {
    private readonly documentRepository;
    constructor(documentRepository: Repository<Document>);
    uploadDocument(file: Express.Multer.File, documentDto: CreateDocumentDto, uploadedById: string): Promise<Document>;
    findById(id: string, requestingUserId: string): Promise<Document>;
    findByLease(leaseId: string): Promise<Document[]>;
    findByProperty(propertyId: string): Promise<Document[]>;
    delete(id: string, requestingUserId: string): Promise<void>;
}
