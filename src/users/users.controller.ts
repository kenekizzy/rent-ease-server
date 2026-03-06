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
    // Additional check for self-access
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

  @Delete(':id')
  @LandlordsOnly()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }
}