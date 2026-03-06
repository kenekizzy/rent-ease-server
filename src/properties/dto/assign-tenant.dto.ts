import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignTenantDto {
  @IsUUID(4, { message: 'Tenant ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Tenant ID is required' })
  tenantId: string;
}
