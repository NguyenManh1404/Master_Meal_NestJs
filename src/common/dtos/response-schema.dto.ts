import {ApiResponse} from '@nestjs/swagger';
import {applyDecorators} from '@nestjs/common';

export const OpenApiResponseStatus204 = () => {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description: 'Successfully.',
      schema: {
        properties: {
          status: {
            type: 'integer',
            default: 204,
          },
          message: {
            type: 'string',
            default: 'Successfully.',
          },
        },
      },
    })
  );
};

export const OpenApiResponseStatus401 = () => {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        properties: {
          status: {
            type: 'integer',
            default: 401,
          },
          message: {
            type: 'string',
            default: 'Unauthorized',
          },
        },
      },
    })
  );
};
