import {
  ValidationPipe as NestValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export class CustomValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = this.formatErrors(errors);
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
          statusCode: 400,
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const result: string[] = [];

    const processError = (error: ValidationError, parentPath = '') => {
      const propertyPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          result.push(`${propertyPath}: ${constraint}`);
        });
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((child) => {
          processError(child, propertyPath);
        });
      }
    };

    errors.forEach((error) => processError(error));
    return result;
  }
}
