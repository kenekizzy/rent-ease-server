"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidMimeType = IsValidMimeType;
exports.IsValidFileSize = IsValidFileSize;
const class_validator_1 = require("class-validator");
function IsValidMimeType(allowedTypes, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidMimeType',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [allowedTypes],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [allowedMimeTypes] = args.constraints;
                    if (!value)
                        return true;
                    return allowedMimeTypes.includes(value);
                },
                defaultMessage(args) {
                    const [allowedMimeTypes] = args.constraints;
                    return `MIME type must be one of: ${allowedMimeTypes.join(', ')}`;
                },
            },
        });
    };
}
function IsValidFileSize(maxSizeInBytes, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidFileSize',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [maxSizeInBytes],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [maxSize] = args.constraints;
                    if (!value)
                        return true;
                    return typeof value === 'number' && value <= maxSize && value > 0;
                },
                defaultMessage(args) {
                    const [maxSize] = args.constraints;
                    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
                    return `File size must be positive and not exceed ${maxSizeMB} MB`;
                },
            },
        });
    };
}
//# sourceMappingURL=file.validator.js.map