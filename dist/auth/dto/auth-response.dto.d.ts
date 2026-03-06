import { UserResponseDto } from '../../users/dto/user-response.dto';
export declare class AuthResponseDto {
    user: UserResponseDto;
    accessToken?: string;
    tokenType?: string;
    constructor(user: UserResponseDto, accessToken?: string);
}
