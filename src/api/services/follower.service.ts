import { Injectable } from '@nestjs/common';
import FollowerModel from '../../database/models/follower.model';
import { CrudService } from '../../common/services/crud.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FollowerService extends CrudService<FollowerModel>  {
  constructor(
    @InjectModel(FollowerModel)
    protected model: typeof FollowerModel
  ) {
    super();
  }
}
