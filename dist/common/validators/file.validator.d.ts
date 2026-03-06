import { ValidationOptions } from 'class-validator';
export declare function IsValidMimeType(allowedTypes: string[], validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidFileSize(maxSizeInBytes: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
