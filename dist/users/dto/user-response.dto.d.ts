import { UserRole } from '../entities/user.entity';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
    constructor(partial: Partial<UserResponseDto>);
}
