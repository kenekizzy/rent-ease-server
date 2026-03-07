import { Controller, UseGuards, Get, HttpCode, HttpStatus, Post, Patch, Delete, Param, Body, Req, ParseUUIDPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto';
import { UpdatePropertyDto } from './dto';
import { JwtAuthGuard } from 'src/auth';
import { RolesGuard } from 'src/auth';
import { Roles } from 'src/auth';
import { UserRole } from 'src/users/entities';
import { CurrentUser } from 'src/auth';
import { User } from 'src/users/entities';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDLORD)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePropertyDto, @CurrentUser() user: User) {
    return this.propertiesService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.propertiesService.findAll(user.id);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: User) {
    return this.propertiesService.getOccupancySummary(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.propertiesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.propertiesService.remove(id, user.id);
  }
}
