import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {OpenApiResponseWithPagination, PaginationResponse} from '../../common/dtos/pagination.dto';
import {Request} from 'express';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
  OpenApiResponseStatus200
} from '../../common/responses/200.response';
import {UserCreateRequest} from '../requests/users/user-create.request';
import {UserUpdateRequest} from '../requests/users/user-update.request';
import {ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags} from '@nestjs/swagger';
import {ServerErrorResponseSchema} from '../../common/errors/server.error';
import {OpenApiResponseStatus401} from '../../common/dtos/response-schema.dto';
import {UserResponse} from '../responses/users/user.response';
import {OpenApiResponseStatus404} from '../../common/responses/404.response';
import {OpenApiResponseStatus422} from '../../common/dtos/validation.dto';
import {OpenApiResponseStatus201} from '../../common/responses/201.response';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {Roles} from '../../common/decorators/roles.decorator';
import {RoleTypes} from '../../common/constants/role.const';
import {RolesGuard} from '../guards/roles.guard';
import {NotFoundError} from '../../common/errors/not-found.error';

@Controller('/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('Bearer')
@ApiInternalServerErrorResponse({description: 'Server error', type: ServerErrorResponseSchema})
@OpenApiResponseStatus401()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Get()
  @HttpCode(200)
  @OpenApiResponseWithPagination(UserResponse)
  public async index(
    @Req() request: Request
  ): Promise<PaginationResponse<UserResponse>> {
    return this.userService.getAll(request);
  }

  @Get(':id')
  @HttpCode(200)
  @OpenApiResponseStatus200(UserResponse)
  @OpenApiResponseStatus404()
  public async show(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<UserResponse>> {
    const user = await this.userService.findById(id);
    return new ApiResponseStatus200(
      'Get user successfully.',
      new UserResponse(user)
    );
  }

  @Post('')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(201)
  @OpenApiResponseStatus201(UserResponse)
  @OpenApiResponseStatus422()
  public async create(
    @Body() attrs: UserCreateRequest
  ): Promise<ApiResponseStatus200Schema<UserResponse>> {
    const user = await this.userService.create(attrs);
    return new ApiResponseStatus200(
      'User created successfully.',
      new UserResponse(user)
    );
  }

  @Put(':id')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(200)
  @OpenApiResponseStatus200(UserResponse)
  @OpenApiResponseStatus404()
  @OpenApiResponseStatus422()
  public async update(
    @Param('id') id: string,
    @Body() attrs: UserUpdateRequest
  ): Promise<ApiResponseStatus200Schema<UserResponse>> {
    const user = await this.userService.update(id, attrs);
    return new ApiResponseStatus200(
      'User updated successfully.',
      new UserResponse(user)
    );
  }

  @Delete(':id')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(200)
  @OpenApiResponseStatus404()
  public async destroy(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<boolean>> {
    return new ApiResponseStatus200(
      'User deleted successfully.',
      await this.userService.delete(id)
    );
  }
}
