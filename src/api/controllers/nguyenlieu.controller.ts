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
import { NguyenLieuResponse } from '../responses/nguyenlieu/nguyenlieu.response';
import { NguyenLieuService } from '../services/nguyenlieu.service';
import { NguyenLieuCreateRequest } from '../requests/nguyenlieu/nguyenlieu-create.request';

@Controller('nguyenlieu')
@ApiTags('Nguyen lieu')
@ApiInternalServerErrorResponse({
  description: 'Server error',
  type: ServerErrorResponseSchema,
})
// @ApiBearerAuth('Bearer')
// @UseGuards(JwtAuthGuard)
export class NguyenLieuController {
  constructor(protected readonly nguyenLieuService: NguyenLieuService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'get all' })
  @OpenApiResponseWithPagination(NguyenLieuResponse)
  public async index(
    @Req() request: ExpressRequest,
    @Request() req: JWTRequest
  ): Promise<PaginationResponse<NguyenLieuResponse>> {
    return this.nguyenLieuService.getAll({}, request);
  }

  @Post('')
  @HttpCode(201)
  @OpenApiResponseStatus201(NguyenLieuResponse)
  @OpenApiResponseStatus422()
  public async create(
    @Body() attrs: NguyenLieuCreateRequest
  ): Promise<ApiResponseStatus200Schema<BaiDangCongThucResponse>> {
    const nguyenLieu = await this.nguyenLieuService.create(attrs);
    return new ApiResponseStatus201(
      'Nguyen Lieu created successfully.',
      new NguyenLieuResponse(nguyenLieu.dataValues)
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get nguyen lieu detail' })
  @OpenApiResponseStatus200(NguyenLieuResponse)
  @OpenApiResponseStatus404()
  public async show(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<NguyenLieuResponse>> {
    return new ApiResponseStatus200(
      'Get nguyen lieu detail successfully.',
      await this.nguyenLieuService.findById(id)
    );
  }

  @Delete(':id')
  @HttpCode(200)
  @OpenApiResponseStatus404()
  public async destroy(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<boolean>> {
    return new ApiResponseStatus200(
      'Nguyen lieu deleted successfully.',
      await this.nguyenLieuService.delete(id)
    );
  }
}
