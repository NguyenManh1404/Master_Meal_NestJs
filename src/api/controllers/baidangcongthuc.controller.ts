import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ServerErrorResponseSchema } from '../../common/errors/server.error';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BaiDangCongThucService } from '../services/baidangcongthuc.service';
import {
  ApiResponseStatus201,
  OpenApiResponseStatus201,
} from '../../common/responses/201.response';
import { BaiDangCongThucResponse } from '../responses/baidangcongthuc/baidangcongthuc.response';
import { OpenApiResponseStatus422 } from '../../common/dtos/validation.dto';
import { BaiDangCongThucCreateRequest } from '../requests/baidangcongthuc/baidangcongthuc-create.request';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
  OpenApiResponseStatus200,
} from '../../common/responses/200.response';
import { OpenApiResponseStatus404 } from '../../common/responses/404.response';
import {
  OpenApiResponseWithPagination,
  PaginationResponse,
} from '../../common/dtos/pagination.dto';
import { Request as ExpressRequest } from 'express';
import { JWTRequest } from '../strageries/jwt.strategy';

@Controller('baidangcongthuc')
@ApiTags('Bai dang cong thuc')
@ApiInternalServerErrorResponse({
  description: 'Server error',
  type: ServerErrorResponseSchema,
})
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
export class BaidangcongthucController {
  constructor(
    protected readonly baidangconthucService: BaiDangCongThucService
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all bai dang cong thuc of current user' })
  @OpenApiResponseWithPagination(BaiDangCongThucResponse)
  public async index(
    @Req() request: ExpressRequest,
    @Request() req: JWTRequest
  ): Promise<PaginationResponse<BaiDangCongThucResponse>> {
    return this.baidangconthucService.getAll(
      {
        where: {
          user_id: req.user.attributes.id,
        },
      },
      request
    );
  }

  @Post('')
  @HttpCode(201)
  @OpenApiResponseStatus201(BaiDangCongThucResponse)
  @OpenApiResponseStatus422()
  public async create(
    @Body() attrs: BaiDangCongThucCreateRequest
  ): Promise<ApiResponseStatus200Schema<BaiDangCongThucResponse>> {
    const baiDangCongThuc = await this.baidangconthucService.create(attrs);
    return new ApiResponseStatus201(
      'Bai dang con thuc created successfully.',
      new BaiDangCongThucResponse(baiDangCongThuc.dataValues)
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get bai dang cong thuc detail' })
  @OpenApiResponseStatus200(BaiDangCongThucResponse)
  @OpenApiResponseStatus404()
  public async show(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<BaiDangCongThucResponse>> {
    return new ApiResponseStatus200(
      'Get bai dang cong thuc detail successfully.',
      await this.baidangconthucService.findById(id)
    );
  }

  @Delete(':id')
  @HttpCode(200)
  @OpenApiResponseStatus404()
  public async destroy(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<boolean>> {
    return new ApiResponseStatus200(
      'Bai dang cong thuc deleted successfully.',
      await this.baidangconthucService.delete(id)
    );
  }
}
