import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';

interface IsFileOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

// tslint:disable-next-line:typedef
export function IsImageType(options: IsFileOptions, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string): void => {
    return registerDecorator({
      propertyName,
      name: 'isFile',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
          return !!(value?.mimetype && (options?.mime ?? []).includes(value?.mimetype));
        },
      },
    });
  };
}
