import {IsBoolean, IsInt, IsObject, ValidateNested} from 'class-validator';
import {applyDecorators, Type} from '@nestjs/common';
import {ApiResponse, getSchemaPath} from '@nestjs/swagger';

export const OpenApiResponseWithPagination = <TSchema extends Type>(schema?: TSchema) => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully.',
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                default: true,
              },
              meta: {
                $ref: getSchemaPath(PaginationMeta),
              },
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

export class PaginationMeta {
  @IsInt()
  public limit: number;

  @IsInt()
  public count: number;

  @IsInt()
  public currentPage: number;

  @IsInt()
  public nextPage?: number | null;

  @IsInt()
  public prevPage?: number | null;

  @IsInt()
  public lastPage: number | null;
}

export class PaginationResponse<T> {
  @IsBoolean()
  public success: boolean;

  @IsObject()
  @ValidateNested()
  public meta: PaginationMeta;

  public data: T[];

  constructor(entities: T[], metaData: PaginationMeta) {
    this.data = entities;
    this.meta = metaData;
  }
}
