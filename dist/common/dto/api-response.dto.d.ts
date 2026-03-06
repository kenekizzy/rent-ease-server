export declare class ApiResponseDto<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    timestamp: string;
    constructor(data?: T, message?: string, success?: boolean);
}
export declare class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    constructor(data: T[], page: number, limit: number, total: number, message?: string);
}
