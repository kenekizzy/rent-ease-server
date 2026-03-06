import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  user: UserResponseDto;
  accessToken?: string;
  tokenType?: string = 'Bearer';

  constructor(user: UserResponseDto, accessToken?: string) {
    this.user = user;
    this.accessToken = accessToken;
  }
}
