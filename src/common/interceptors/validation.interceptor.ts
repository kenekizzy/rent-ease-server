import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';

interface ValidationErrorResponse {
  message: string;
  errors?: string[];
  statusCode: number;
  timestamp?: string;
  path?: string;
  method?: string;
}

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse() as ValidationErrorResponse;

          // Enhance validation error response with additional context
          if (response.message === 'Validation failed' && response.errors) {
            const request = context.switchToHttp().getRequest<Request>();
            const enhancedResponse: ValidationErrorResponse = {
              ...response,
              timestamp: new Date().toISOString(),
              path: request.url,
              method: request.method,
            };

            throw new BadRequestException(enhancedResponse);
          }
        }

        throw error;
      }),
    );
  }
}
