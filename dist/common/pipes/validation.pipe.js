"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class CustomValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors) => {
                const formattedErrors = this.formatErrors(errors);
                return new common_1.BadRequestException({
                    message: 'Validation failed',
                    errors: formattedErrors,
                    statusCode: 400,
                });
            },
        });
    }
    formatErrors(errors) {
        const result = [];
        const processError = (error, parentPath = '') => {
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
exports.CustomValidationPipe = CustomValidationPipe;
//# sourceMappingURL=validation.pipe.js.map