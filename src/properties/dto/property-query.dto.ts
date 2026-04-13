import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { PropertyStatus } from '../entities/property.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PropertyQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PropertyStatus, {
    message: 'Status must be available, occupied, or maintenance',
  })
  status?: PropertyStatus;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Landlord ID must be a valid UUID' })
  landlordId?: string;
}
