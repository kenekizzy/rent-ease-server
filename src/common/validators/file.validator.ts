import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidMimeType(
  allowedTypes: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidMimeType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedTypes],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [allowedMimeTypes] = args.constraints as [string[]];
          if (!value) return true; // Let other validators handle required validation
          return allowedMimeTypes.includes(value as string);
        },
        defaultMessage(args: ValidationArguments) {
          const [allowedMimeTypes] = args.constraints as [string[]];
          return `MIME type must be one of: ${allowedMimeTypes.join(', ')}`;
        },
      },
    });
  };
}

export function IsValidFileSize(
  maxSizeInBytes: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidFileSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxSizeInBytes],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [maxSize] = args.constraints as [number];
          if (!value) return true; // Let other validators handle required validation
          return typeof value === 'number' && value <= maxSize && value > 0;
        },
        defaultMessage(args: ValidationArguments) {
          const [maxSize] = args.constraints as [number];
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
          return `File size must be positive and not exceed ${maxSizeMB} MB`;
        },
      },
    });
  };
}
