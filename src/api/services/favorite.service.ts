import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/services/crud.service';
import { InjectModel } from '@nestjs/sequelize';
import FavoriteModel from '../../database/models/favorite.model';

@Injectable()
export class FavoriteService extends CrudService<FavoriteModel> {
  constructor(
    @InjectModel(FavoriteModel)
    protected model: typeof FavoriteModel
  ) {
    super();
  }
}
