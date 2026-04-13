import { Controller, UseGuards, Get, HttpCode, HttpStatus, Post, Patch, Delete, Param, Body, Req, ParseUUIDPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto';
import { UpdatePropertyDto } from './dto';
import { JwtAuthGuard } from '../auth';
import { RolesGuard } from '../auth';
import { Roles } from '../auth';
import { UserRole } from '../users/entities';
import { CurrentUser } from '../auth';
import { User } from '../users/entities';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles(UserRole.LANDLORD)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePropertyDto, @CurrentUser() user: User) {
    return this.propertiesService.create(user.id, dto);
  }

  @Get()
  @Roles(UserRole.LANDLORD)
  findAll(@CurrentUser() user: User) {
    return this.propertiesService.findAll(user.id);
  }

  @Get('leased')
  @Roles(UserRole.TENANT)
  findLeased(@CurrentUser() user: User) {
    return this.propertiesService.findLeasedProperties(user.id);
  }

  @Get('summary')
  @Roles(UserRole.LANDLORD)
  getSummary(@CurrentUser() user: User) {
    return this.propertiesService.getOccupancySummary(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.propertiesService.findOne(id, user.id);
  }

  @Patch(':id')
  @Roles(UserRole.LANDLORD)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.LANDLORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.propertiesService.remove(id, user.id);
  }
}
