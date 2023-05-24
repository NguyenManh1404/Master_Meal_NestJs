import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrudService } from '../../common/services/crud.service';
import AdminModel from '../../database/models/admin.model';
import { Request } from 'express';
import { PaginationResponse } from '../../common/dtos/pagination.dto';
import { AdminResponse } from '../responses/admins/admin.response';
import LoginHistoryModel from '../../database/models/login-history.model';
import { AdminCreateRequest } from '../requests/admins/admin-create.request';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService extends CrudService<AdminModel> {
  constructor(
    @InjectModel(AdminModel)
    protected model: typeof AdminModel
  ) {
    super();
  }

  public async create(attrs: AdminCreateRequest): Promise<AdminModel> {
    const admin = new AdminModel();
    admin.name = attrs.name;
    admin.email = attrs.email;
    admin.password = await bcrypt.hash(attrs.password, 10);
    await admin.save();
    return admin;
  }

  public async getAll(
    request: Request
  ): Promise<PaginationResponse<AdminResponse>> {
    const data = await this.getByQueryParams(
      {
        include: [
          {
            model: LoginHistoryModel,
            separate: true, // <--- Run separate query
            limit: 5,
          },
        ],
      },
      request
    );
    const entities = data.rows.map((row) => new AdminResponse(row));
    return this.paginateResponse([entities, data.count], request);
  }

  public async findCurrentAdmin(id: string): Promise<AdminModel> {
    return this.model.findOne({
      where: { id },
    });
  }
}
