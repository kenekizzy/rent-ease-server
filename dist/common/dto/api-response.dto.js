"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseDto = exports.ApiResponseDto = void 0;
class ApiResponseDto {
    success;
    data;
    message;
    errors;
    timestamp;
    constructor(data, message, success = true) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
}
exports.ApiResponseDto = ApiResponseDto;
class PaginatedResponseDto extends ApiResponseDto {
    pagination;
    constructor(data, page, limit, total, message) {
        super(data, message);
        this.pagination = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
//# sourceMappingURL=api-response.dto.js.map