import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
} from '../../common/responses/200.response';
import {} from '../../common/dtos/response-schema.dto';
import { OpenApiResponseStatus422 } from '../../common/dtos/validation.dto';
import { ServerErrorResponseSchema } from '../../common/errors/server.error';
import { FollowerService } from '../services/follower.service';
import {
  ApiResponseStatus201,
  OpenApiResponseStatus201,
} from '../../common/responses/201.response';
import { FollowerResponse } from '../responses/follower/follower.response';
import { FollowerCreateRequest } from '../requests/follower/follower-create.request';
import { OpenApiResponseStatus404 } from '../../common/responses/404.response';

@Controller('follower')
@ApiTags('Follower')
@ApiInternalServerErrorResponse({
  description: 'Server error',
  type: ServerErrorResponseSchema,
})
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
export class FollowerController {
  constructor(protected readonly followerService: FollowerService) {}

  @Post('')
  @HttpCode(201)
  @OpenApiResponseStatus201(FollowerResponse)
  @OpenApiResponseStatus422()
  public async create(
    @Body() attrs: FollowerCreateRequest
  ): Promise<ApiResponseStatus200Schema<FollowerResponse>> {
    const follower = await this.followerService.create(attrs);
    return new ApiResponseStatus201(
      'Follower created successfully.',
      new FollowerResponse(follower.dataValues)
    );
  }

  @Delete(':id')
  @HttpCode(200)
  @OpenApiResponseStatus404()
  public async destroy(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<boolean>> {
    return new ApiResponseStatus200(
      'Follower deleted successfully.',
      await this.followerService.delete(id)
    );
  }
}
