import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, HttpCode, HttpStatus, Get, Param, Body, Req, Res, ParseUUIDPipe, Delete } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from 'src/auth';
import type { Response } from 'express';
import * as fs from 'fs';
import { memoryStorage } from 'multer';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  /**
   * POST /documents/upload
   * Accepts multipart/form-data with:
   *   - file        : the binary file
   *   - leaseId     : (optional) UUID
   *   - propertyId  : (optional) UUID
   *   - accessLevel : (optional) 'landlord' | 'tenant' | 'both'
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // hold in buffer; service writes to disk / cloud
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB guard at transport layer
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
    @Req() req: any,
  ) {
    const document = await this.filesService.uploadDocument(file, dto, req.user.id);
    return {
      message: 'Document uploaded successfully.',
      data: document,
    };
  }

  /**
   * GET /documents/:id
   * Returns document metadata; use /documents/:id/download for the file stream.
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.filesService.findById(id, req.user.id);
  }

  /**
   * GET /documents/:id/download
   * Streams the raw file back to the client.
   */
  @Get(':id/download')
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const doc = await this.filesService.findById(id, req.user.id);
    res.setHeader('Content-Type', doc.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);
    fs.createReadStream(doc.filePath).pipe(res);
  }

  /**
   * GET /documents/lease/:leaseId
   * All documents attached to a specific lease.
   */
  @Get('lease/:leaseId')
  async byLease(@Param('leaseId', ParseUUIDPipe) leaseId: string) {
    return this.filesService.findByLease(leaseId);
  }

  /**
   * GET /documents/property/:propertyId
   * All documents attached to a specific property.
   */
  @Get('property/:propertyId')
  async byProperty(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.filesService.findByProperty(propertyId);
  }

  /**
   * DELETE /documents/:id
   * Removes DB record and file from disk. Only the uploader may delete.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    await this.filesService.delete(id, req.user.id);
  }
}
