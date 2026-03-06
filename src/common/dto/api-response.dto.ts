export class ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;

  constructor(data?: T, message?: string, success: boolean = true) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
  ) {
    super(data, message);
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
