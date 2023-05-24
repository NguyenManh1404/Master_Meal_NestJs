import { PaginationResponse } from '../dtos/pagination.dto';
import { Request } from 'express';
import { Attributes, FindAndCountOptions, FindOptions } from 'sequelize/types/model';
import { Model } from 'sequelize-typescript';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';

export class CrudService<M extends Model> {
  protected model: any;

  public async findById(
    id: string
  ): Promise<M> {
    const model = await this.model.findOne({
      where: {id},
    });
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  public async findBy(
    options: FindOptions<Attributes<M>>
  ): Promise<M> {
    return this.model.findOne(options);
  }

  public async create(
    attrs: any
  ): Promise<M> {
    return this.model.create(attrs);
  }

  public async update(
    id: string,
    attrs: any
  ): Promise<M> {
    const model = await this.findById(id);
    await model.update(attrs);
    return model;
  }

  public async delete(
    id: string
  ): Promise<boolean> {
    const model = await this.findById(id);
    await model.destroy();
    return true;
  }

  public async getByQueryParams(
    options: Omit<FindAndCountOptions<Attributes<any>>, 'group'>,
    request: Request
  ): Promise<{ rows: M[]; count: number }> {
    if (!!request.query.s) {
      if (!options.where) {
        options.where = {};
      }
      const attributes = this.model.getAttributes();
      const searchLikeGroup = {};
      Object.keys(attributes).map(attrName => {
        const attrType = attributes[attrName].type.key.toLowerCase();
        if (attrType === 'string' || attrType === 'text') {
          searchLikeGroup[attrName] = {
            [Op.like]: `%${request.query.s}%`,
          };
        }
      });
      options.where[Op.or] = searchLikeGroup;
    }

    const limit = request.query.limit ? Number(request.query.limit) : 15;
    const page = request.query.page ? Number(request.query.page) : 1;
    const skip = (Number(page) - 1) * Number(limit);
    return await this.model.findAndCountAll({
      ...options,
      limit,
      offset: skip,
    });
  }

  protected paginateResponse<T>(
    data: [T[], number],
    request: Request
  ): PaginationResponse<T> {
    const limit = request.query.limit ? Number(request.query.limit) : 15;
    const page = request.query.page ? Number(request.query.page) : 1;
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? undefined : page + 1;
    const prevPage = page - 1 < 1 ? undefined : page - 1;
    return new PaginationResponse(result, {
      count: total,
      currentPage: page,
      limit,
      nextPage,
      prevPage,
      lastPage,
    });
  }
}
