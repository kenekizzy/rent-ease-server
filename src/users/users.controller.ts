import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { LandlordsOnly, AllowSelfOrRoles } from '../auth/decorators/authorize.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @LandlordsOnly()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => new UserResponseDto(user));
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    const fullUser = await this.usersService.findOne(user.id);
    return new UserResponseDto(fullUser);
  }

  @Get(':id')
  @AllowSelfOrRoles(UserRole.LANDLORD)
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User): Promise<UserResponseDto> {
    if (currentUser.id !== id && currentUser.role !== UserRole.LANDLORD) {
      throw new ForbiddenException('You can only view your own profile');
    }
    
    const user = await this.usersService.findOne(id);
    return new UserResponseDto(user);
  }

  @Patch(':id')
  @AllowSelfOrRoles(UserRole.LANDLORD)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponseDto> {
    // Users can only update their own profile unless they're landlords
    if (currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    return new UserResponseDto(updatedUser);
  }

  @Delete(':id')
  @LandlordsOnly()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }

  @Patch('profile/password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return await this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Get('profile/notifications')
  async getNotificationSettings(@CurrentUser() user: User) {
    return await this.usersService.getNotificationPreferences(user.id);
  }

  @Patch('profile/notifications')
  async updateNotificationSettings(
    @CurrentUser() user: User,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return await this.usersService.updateNotificationPreferences(user.id, dto);
  }
}