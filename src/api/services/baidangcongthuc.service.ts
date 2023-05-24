import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/services/crud.service';
import { InjectModel } from '@nestjs/sequelize';
import BaiDangCongThucModel from '../../database/models/baidangcongthuc.model';
import { Attributes, FindAndCountOptions } from 'sequelize';
import { Request } from 'express';
import { PaginationResponse } from '../../common/dtos/pagination.dto';
import { BaiDangCongThucResponse } from '../responses/baidangcongthuc/baidangcongthuc.response';
import { Op } from 'sequelize';

@Injectable()
export class BaiDangCongThucService extends CrudService<BaiDangCongThucModel> {
  constructor(
    @InjectModel(BaiDangCongThucModel)
    protected model: typeof BaiDangCongThucModel
  ) {
    super();
  }

  public async getAll(
    options: Omit<
      FindAndCountOptions<Attributes<BaiDangCongThucModel>>,
      'group'
    >,
    request: Request
  ): Promise<PaginationResponse<BaiDangCongThucResponse>> {
    if (!!request.query.ten_bai_dang) {
      options.where = {
        ten_bai_dang: {
          [Op.like]: `%${request.query.ten_bai_dang}%`,
        },
      };
    }
    const data = await this.getByQueryParams(options, request);
    const entities = data.rows.map((row) => new BaiDangCongThucResponse(row));
    return this.paginateResponse([entities, data.count], request);
  }
}
