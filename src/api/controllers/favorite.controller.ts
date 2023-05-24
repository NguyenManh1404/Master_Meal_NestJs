import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
  OpenApiResponseStatus200,
} from '../../common/responses/200.response';
import {} from '../../common/dtos/response-schema.dto';
import { OpenApiResponseStatus422 } from '../../common/dtos/validation.dto';
import { ServerErrorResponseSchema } from '../../common/errors/server.error';
import {
  ApiResponseStatus201,
  OpenApiResponseStatus201,
} from '../../common/responses/201.response';
import { OpenApiResponseStatus404 } from '../../common/responses/404.response';
import { FavoriteCreateRequest } from '../requests/favorite/favorite-create.request';
import { FavoriteResponse } from '../responses/favorite/favorite.response';
import { FavoriteService } from '../services/favorite.service';

@Controller('favorite')
@ApiTags('Favorite')
@ApiInternalServerErrorResponse({
  description: 'Server error',
  type: ServerErrorResponseSchema,
})
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(protected readonly favoriteService: FavoriteService) {}

  @Post('')
  @HttpCode(201)
  @OpenApiResponseStatus201(FavoriteResponse)
  @OpenApiResponseStatus422()
  public async create(
    @Body() attrs: FavoriteCreateRequest
  ): Promise<ApiResponseStatus200Schema<FavoriteResponse>> {
    const favorite = await this.favoriteService.create(attrs);
    return new ApiResponseStatus201(
      'Follower created successfully.',
      new FavoriteResponse(favorite.dataValues)
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get favorite detail' })
  @OpenApiResponseStatus200(FavoriteResponse)
  @OpenApiResponseStatus404()
  public async show(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<FavoriteResponse>> {
    return new ApiResponseStatus200(
      'Get favorite detail successfully.',
      await this.favoriteService.findById(id)
    );
  }

  @Delete(':id')
  @HttpCode(200)
  @OpenApiResponseStatus404()
  public async destroy(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<boolean>> {
    return new ApiResponseStatus200(
      'Favorite deleted successfully.',
      await this.favoriteService.delete(id)
    );
  }
}
