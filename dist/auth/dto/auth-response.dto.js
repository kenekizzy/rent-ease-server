"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
class AuthResponseDto {
    user;
    accessToken;
    tokenType = 'Bearer';
    constructor(user, accessToken) {
        this.user = user;
        this.accessToken = accessToken;
    }
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth-response.dto.js.map