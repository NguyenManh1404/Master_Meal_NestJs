/* istanbul ignore file */

import {applyDecorators, Type} from '@nestjs/common';
import {ApiProperty, ApiResponse, getSchemaPath} from '@nestjs/swagger';

export const OpenApiResponseStatus200Boolean = () => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successfully.',
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResponseStatus200Schema)},
          {
            properties: {
              data: {
                type: 'boolean',
              },
            },
          },
        ],
      },
    })
  );
};

export const OpenApiResponseStatus200 = <TSchema extends Type>(schema?: TSchema) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successfully.',
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResponseStatus200Schema)},
          {
            properties: {
              data: {
                $ref: getSchemaPath(schema),
              },
            },
          },
        ],
      },
    })
  );
};

export const OpenApiResponseStatus200Array = <TSchema extends Type>(schema?: TSchema) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successfully.',
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResponseStatus200Schema)},
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(schema),
                },
              },
            },
          },
        ],
      },
    })
  );
};

export class ApiResponseStatus200Schema<TSchema> {
  @ApiProperty({
    default: 200,
  })
  public statusCode: number;

  @ApiProperty({
    default: 'Successfully.',
  })
  public message: string;

  public data?: TSchema;
}

export class ApiResponseStatus200<T> {

  public statusCode: number;

  public message: string;

  public data: any = null;

  constructor(mess: string, response?: T) {
    this.statusCode = 200;
    this.message = mess;
    this.data = response;
  }
}

export const isApiResponseStatus200 = (response: any): response is ApiResponseStatus200<any> => {
  return (response as ApiResponseStatus200<any>).statusCode === 200;
};
