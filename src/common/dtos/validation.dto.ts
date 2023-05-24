import {ApiProperty, ApiResponse} from '@nestjs/swagger';
import {applyDecorators} from '@nestjs/common';

export const OpenApiResponseStatus422 = () => {
  return applyDecorators(
    ApiResponse({
      status: 422,
      description: 'Validation failed',
      type: BadRequestResponseSchema,
    })
  );
};

export class ValidationError {
  @ApiProperty()
  public property: string[];
}

export class BadRequestResponseSchema {
  @ApiProperty({
    default: 422,
  })
  public status: number;

  @ApiProperty({
    default: 'Bad request.',
  })
  public message: string;

  @ApiProperty()
  public errors: ValidationError;
}
