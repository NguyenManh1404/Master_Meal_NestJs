import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  public catch(
    exception: BadRequestException,
    host: ArgumentsHost
  ): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const cause = exception.getResponse() as any;
    const validationErrors: ValidationError[] = cause.message;
    const errors = {};
    console.error('cause', cause);
    for (const validationError of validationErrors) {
      const errorDetail = [];
      if (validationError.constraints) {
        Object.keys(validationError.constraints).map(key => {
          if (!!validationError.constraints[key]) {
            errorDetail.push(validationError.constraints[key]);
          }
        });
      }
      errors[validationError.property] = errorDetail;
    }

    response
      .status(422)
      .json({
        status: 422,
        message: 'Bad request.',
        errors,
      });
  }
}
