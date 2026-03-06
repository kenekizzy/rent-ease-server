"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ValidationInterceptor = class ValidationInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            if (error instanceof common_1.BadRequestException) {
                const response = error.getResponse();
                if (response.message === 'Validation failed' && response.errors) {
                    const request = context.switchToHttp().getRequest();
                    const enhancedResponse = {
                        ...response,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        method: request.method,
                    };
                    throw new common_1.BadRequestException(enhancedResponse);
                }
            }
            throw error;
        }));
    }
};
exports.ValidationInterceptor = ValidationInterceptor;
exports.ValidationInterceptor = ValidationInterceptor = __decorate([
    (0, common_1.Injectable)()
], ValidationInterceptor);
//# sourceMappingURL=validation.interceptor.js.map