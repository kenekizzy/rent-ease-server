import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PropertyStatus } from './property.enum';
import { Property } from './property.entity';
import { Lease } from '../../lease/entities/lease.entity';

export enum UnitType {
  SELF_CONTAIN = 'self_contain',
  MINI_FLAT = 'mini_flat',
  TWO_BEDROOM = 'two_bedroom',
  THREE_BEDROOM = 'three_bedroom',
  FOUR_BEDROOM = 'four_bedroom',
  FIVE_BEDROOM = 'five_bedroom',
}

@Entity('property_units')
@Index(['propertyId', 'name'], { unique: true })
export class PropertyUnit extends BaseEntity {

  @Column({ type: 'uuid', name: 'property_id' })
  propertyId: string;

  @Column({ type: 'uuid', name: 'lease_id', nullable: true })
  leaseId?: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  tenantId?: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: UnitType,
    name: 'unit_type',
    nullable: true,
  })
  unitType?: UnitType;

  @Column({ type: 'int', nullable: true })
  bedrooms?: number;

  @Column({ type: 'int', nullable: true })
  bathrooms?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'area_sqm', nullable: true })
  areaSqm?: number;

  @Column({ type: 'int', nullable: true, name: 'floor_number' })
  floorNumber?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'rent_amount', nullable: true })
  rentAmount?: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne('Property', (property: Property) => property.units, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToOne('Lease', (lease: Lease) => lease.unit, { nullable: true })
  @JoinColumn({ name: 'lease_id' })
  activeLease?: Lease;
}