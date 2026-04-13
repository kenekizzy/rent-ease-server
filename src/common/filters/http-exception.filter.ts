import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message = 'An error occurred';
    let errors: any[] = [];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const res = exceptionResponse as any;
      message = res.message || 'An error occurred';

      if (res.errors) {
        // Use custom errors from ValidationPipe if available
        errors = Array.isArray(res.errors) ? res.errors : [res.errors];
      } else if (Array.isArray(res.message)) {
        // Handle default NestJS validation error messages
        errors = res.message;
        message = 'Validation failed';
      }
    }

    const errorResponse = new ApiResponseDto(null, message, false);
    errorResponse.errors = errors.length > 0 ? errors : [message];

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = new ApiResponseDto(null, 'Request failed', false);
    errorResponse.errors = [message];

    response.status(status).json(errorResponse);
  }
}
