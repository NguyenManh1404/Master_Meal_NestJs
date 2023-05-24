/* istanbul ignore file */

import {applyDecorators, Type} from '@nestjs/common';
import {ApiProperty, ApiResponse, getSchemaPath} from '@nestjs/swagger';

export const OpenApiResponseStatus201 = <TSchema extends Type>(schema?: TSchema) => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully.',
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResponseStatus201Schema)},
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

export class ApiResponseStatus201Schema<TSchema> {
  @ApiProperty({
    default: 201,
  })
  public statusCode: number;

  @ApiProperty({
    default: 'Successfully.',
  })
  public message: string;

  public data: TSchema;
}

export class ApiResponseStatus201 {

  public statusCode: number;

  public message: string;

  public data: any = null;

  constructor(mess: string, response?: any) {
    this.statusCode = 201;
    this.message = mess;
    this.data = response;
  }
}

export const isApiResponseStatus201 = (response: any): response is ApiResponseStatus201 => {
  return (response as ApiResponseStatus201).statusCode === 201;
};
