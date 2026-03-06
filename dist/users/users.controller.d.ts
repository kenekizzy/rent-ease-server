import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<UserResponseDto[]>;
    getProfile(user: User): Promise<UserResponseDto>;
    findOne(id: string, currentUser: User): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
}
