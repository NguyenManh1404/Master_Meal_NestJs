import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions
} from 'class-validator';

interface CheckExistValidationArguments extends ValidationArguments {
  constraints: [any, string];
}

interface CheckExistValidationOptions {
  entityClass: any;
  columnName: string;
}

@ValidatorConstraint({async: true})
export class CheckExistValidatorConstrain implements ValidatorConstraintInterface {
  public async validate<E>(value: string, args: CheckExistValidationArguments): Promise<boolean> {
    if (!value) {
      return false;
    }
    const [EntityClass, findCondition = args.property] = args.constraints;
    const data = await EntityClass.findOne({
      where: {
        [findCondition]: value,
      },
    });
    return !!data;
  }

  public defaultMessage(args: ValidationArguments): string {
    if (!args.value) {
      return '';
    }
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name.replace('Model', '') || 'Entity';
    return `${entity} with the ${args.property}: "${args.value}" is not exist`;
  }
}

// tslint:disable-next-line:typedef
export function IsExist(
  options: CheckExistValidationOptions,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options.entityClass, options.columnName],
      validator: CheckExistValidatorConstrain,
    });
  };
}
