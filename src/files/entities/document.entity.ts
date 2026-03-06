import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Property } from '../../properties/entities/property.entity';
import { Lease } from '../../lease/entities/lease.entity';
import { User } from '../../users/entities/user.entity';

export enum DocumentFileType {
  PDF = 'pdf',
  IMAGE = 'image',
  TEXT = 'text',
  SPREADSHEET = 'spreadsheet',
  OTHER = 'other',
}

export enum DocumentAccessLevel {
  LANDLORD = 'landlord',
  TENANT = 'tenant',
  BOTH = 'both',
}

@Entity('documents')
export class Document extends BaseEntity {
  @Column({ type: 'uuid', name: 'uploaded_by' })
  uploadedById: string;

  @Column({ type: 'uuid', name: 'lease_id', nullable: true })
  leaseId: string;

  @Column({ type: 'uuid', name: 'property_id', nullable: true })
  propertyId: string;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', length: 500, name: 'file_path' })
  filePath: string;

  @Column({ type: 'enum', enum: DocumentFileType, name: 'file_type' })
  fileType: DocumentFileType;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int', name: 'file_size_kb' })
  fileSizeKb: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: DocumentAccessLevel,
    name: 'access_level',
    default: DocumentAccessLevel.BOTH,
  })
  accessLevel: DocumentAccessLevel;

  // Relations
  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @ManyToOne(() => Lease, (lease) => lease.documents, { nullable: true })
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;

  @ManyToOne(() => Property, (property) => property.documents, { nullable: true })
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
