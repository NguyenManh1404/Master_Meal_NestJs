import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { PaginationResponse } from '../../common/dtos/pagination.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AdminResponse } from '../responses/admins/admin.response';
import {
  ApiResponseStatus200,
  ApiResponseStatus200Schema,
} from '../../common/responses/200.response';
import {
  ApiResponseStatus201,
  ApiResponseStatus201Schema,
} from '../../common/responses/201.response';
import { AdminCreateRequest } from '../requests/admins/admin-create.request';
import { AdminUpdateRequest } from '../requests/admins/admin-update.request';
import { JwtStrategy } from '../strageries/jwt.strategy';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleTypes } from '../../common/constants/role.const';

@Controller('/admins')
@ApiTags('Admins Management')
@UseGuards(JwtStrategy)
@ApiBearerAuth('Bearer')
@ApiExcludeController()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(RoleTypes.ADMIN)
  public async index(
    @Req() request: Request
  ): Promise<PaginationResponse<AdminResponse>> {
    return this.adminService.getAll(request);
  }

  @Get(':id')
  @Roles(RoleTypes.ADMIN)
  public async show(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<AdminResponse>> {
    const admin = await this.adminService.findById(id);
    return new ApiResponseStatus200(
      'Admin get successfully.',
      new AdminResponse(admin)
    );
  }

  @Post('')
  @Roles(RoleTypes.ADMIN)
  public async create(
    @Body() attrs: AdminCreateRequest
  ): Promise<ApiResponseStatus201Schema<AdminResponse>> {
    const admin = await this.adminService.create(attrs);
    return new ApiResponseStatus201(
      'Admin created successfully.',
      new AdminResponse(admin)
    );
  }

  @Put(':id')
  @Roles(RoleTypes.ADMIN)
  public async update(
    @Param('id') id: string,
    @Body() attrs: AdminUpdateRequest
  ): Promise<ApiResponseStatus200Schema<AdminResponse>> {
    const admin = await this.adminService.update(id, attrs);
    return new ApiResponseStatus200(
      'Admin updated successfully.',
      new AdminResponse(admin)
    );
  }

  @Delete(':id')
  @Roles(RoleTypes.ADMIN)
  public async destroy(
    @Param('id') id: string
  ): Promise<ApiResponseStatus200Schema<any>> {
    const isDeleted = await this.adminService.delete(id);
    return new ApiResponseStatus200('Admin deleted successfully.', isDeleted);
  }
}
