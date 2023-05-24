import {applyDecorators, Type} from '@nestjs/common';
import {ApiResponse} from '@nestjs/swagger';

export const OpenApiResponseStatus404 = () => {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: 'Not found',
      schema: {
        properties: {
          statusCode: {
            type: 'integer',
            default: 404,
          },
          message: {
            type: 'string',
            default: 'Not found',
          },
        },
      },
    })
  );
};
