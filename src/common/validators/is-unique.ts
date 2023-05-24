import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions
} from 'class-validator';

interface UniqueValidationArguments extends ValidationArguments {
  constraints: [any, string];
}

interface UniqueValidationOptions {
  entityClass: any;
  columnName: string;
}

@ValidatorConstraint({async: true})
export class UniqueValidatorConstrain implements ValidatorConstraintInterface {
  public async validate(value: string, args: UniqueValidationArguments): Promise<boolean> {
    if (!value) {
      return false;
    }
    const [EntityClass, findCondition = args.property] = args.constraints;
    const data = await EntityClass.findOne({
      where: {
        [findCondition]: value,
      },
    });
    return !data;
  }

  public defaultMessage(args: ValidationArguments): string {
    if (!args.value) {
      return '';
    }
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name.replace('Model', '') || 'Entity';
    return `${entity} with the ${args.property}: '${args.value}' is already existed.`;
  }
}

// tslint:disable-next-line:typedef
export function IsUnique(options: UniqueValidationOptions, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options.entityClass, options.columnName],
      validator: UniqueValidatorConstrain,
    });
  };
}
