import { FilesService } from './files.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import type { Response } from 'express';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    upload(file: Express.Multer.File, dto: CreateDocumentDto, req: any): Promise<{
        message: string;
        data: import("./entities").Document;
    }>;
    findOne(id: string, req: any): Promise<import("./entities").Document>;
    download(id: string, req: any, res: Response): Promise<void>;
    byLease(leaseId: string): Promise<import("./entities").Document[]>;
    byProperty(propertyId: string): Promise<import("./entities").Document[]>;
    remove(id: string, req: any): Promise<void>;
}
