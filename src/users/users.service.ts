import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationPreference } from '../notifications/entities/notification-preferences.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NotificationPreference)
    private readonly preferenceRepository: Repository<NotificationPreference>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    let passwordHash = '';
    if (createUserDto.password) {
      const saltRounds = 12;
      passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
    }

    // Create user entity
    const user = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    // Remove password from object before returning (but keep it in entity for save)
    const savedUser = await this.userRepository.save(user);

    // Auto-create notification preferences
    const preferences = this.preferenceRepository.create({
      userId: savedUser.id,
    });
    await this.preferenceRepository.save(preferences);

    delete (savedUser as any).password;
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If password is being updated, hash it
    if (updateUserDto.password) {
      const saltRounds = 12;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async changePassword(userId: string, changePasswordDto: any): Promise<void> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'password'] 
    });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isMatch) throw new ConflictException('Incorrect current password');

    const saltRounds = 12;
    user.password = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);
    await this.userRepository.save(user);
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreference> {
    let pref = await this.preferenceRepository.findOne({ where: { userId } });
    if (!pref) {
      pref = this.preferenceRepository.create({ userId });
      pref = await this.preferenceRepository.save(pref);
    }
    return pref;
  }

  async updateNotificationPreferences(userId: string, dto: any): Promise<NotificationPreference> {
    const pref = await this.getNotificationPreferences(userId);
    Object.assign(pref, dto);
    return await this.preferenceRepository.save(pref);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}