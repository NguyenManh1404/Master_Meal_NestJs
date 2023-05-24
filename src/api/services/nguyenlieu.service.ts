import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/services/crud.service';
import { InjectModel } from '@nestjs/sequelize';
import { Attributes, FindAndCountOptions } from 'sequelize';
import { Request } from 'express';
import { PaginationResponse } from '../../common/dtos/pagination.dto';
import { Op } from 'sequelize';
import NguyenLieuModel from '../../database/models/nguyenlieu.model';
import { NguyenLieuResponse } from '../responses/nguyenlieu/nguyenlieu.response';

@Injectable()
export class NguyenLieuService extends CrudService<NguyenLieuModel> {
  constructor(
    @InjectModel(NguyenLieuModel)
    protected model: typeof NguyenLieuModel
  ) {
    super();
  }

  public async getAll(
    options: Omit<FindAndCountOptions<Attributes<NguyenLieuModel>>, 'group'>,
    request: Request
  ): Promise<PaginationResponse<NguyenLieuResponse>> {
    if (!!request.query.ten_nguyen_lieu) {
      options.where = {
        ten_nguyen_lieu: {
          [Op.like]: `%${request.query.ten_nguyen_lieu}%`,
        },
      };
    }
    const data = await this.getByQueryParams(options, request);
    const entities = data.rows.map((row) => new NguyenLieuResponse(row));
    return this.paginateResponse([entities, data.count], request);
  }
}
