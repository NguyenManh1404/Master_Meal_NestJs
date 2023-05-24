import {registerDecorator, ValidationOptions} from 'class-validator';

interface IsDateStringOptions {
  format: RegExp;
}

export function IsDateString(
  options?: IsDateStringOptions,
  validationOptions?: ValidationOptions
): any {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like YYYY-MM-DD',
        ...validationOptions,
      },
      validator: {
        validate: (value: any): boolean => {
          const regex = (options && options.format) ? options.format : /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}
