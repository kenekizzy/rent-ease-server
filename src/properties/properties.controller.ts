import { Controller, UseGuards, Get, HttpCode, HttpStatus, Post, Patch, Delete, Param, Body, Req, ParseUUIDPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto';
import { UpdatePropertyDto } from './dto';
import { JwtAuthGuard } from 'src/auth';
import { RolesGuard } from 'src/auth';
import { Roles } from 'src/auth';
import { UserRole } from 'src/users/entities';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDLORD)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * POST /properties
   * Create a new property. Landlord only.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePropertyDto, @Req() req: any) {
    return this.propertiesService.create(req.user.id, dto);
  }

  /**
   * GET /properties
   * List all properties owned by the authenticated landlord.
   */
  @Get()
  findAll(@Req() req: any) {
    return this.propertiesService.findAll(req.user.id);
  }

  /**
   * GET /properties/summary
   * Occupancy stats for the landlord dashboard.
   */
  @Get('summary')
  getSummary(@Req() req: any) {
    return this.propertiesService.getOccupancySummary(req.user.id);
  }

  /**
   * GET /properties/:id
   * Get a single property with its leases, complaints, and documents.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.propertiesService.findOne(id, req.user.id);
  }

  /**
   * PATCH /properties/:id
   * Update property details or status.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
    @Req() req: any,
  ) {
    return this.propertiesService.update(id, req.user.id, dto);
  }

  /**
   * DELETE /properties/:id
   * Remove a property (only if no active leases exist).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.propertiesService.remove(id, req.user.id);
  }
}
