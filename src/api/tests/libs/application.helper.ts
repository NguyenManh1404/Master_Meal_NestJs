import {BadRequestException, INestApplication, ValidationPipe} from '@nestjs/common';
import {ValidationError} from 'class-validator';
import {BadRequestExceptionFilter} from '../../../common/exception-filters/bad-request-exception.filter';
import {TestingModule} from '@nestjs/testing';

export const initApplicationForTesting = async (
  module: TestingModule
): Promise<INestApplication> => {
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (
      errors: ValidationError[]
    ): any => {
      return new BadRequestException(errors);
    },
  }));
  app.useGlobalFilters(new BadRequestExceptionFilter());
  await app.init();

  return app;
};
