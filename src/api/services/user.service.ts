import { Injectable } from '@nestjs/common';
import UserModel from '../../database/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CrudService } from '../../common/services/crud.service';
import { UserResponse } from '../responses/users/user.response';
import { PaginationResponse } from '../../common/dtos/pagination.dto';
import { Request } from 'express';
import LoginHistoryModel from '../../database/models/login-history.model';
import { UserCreateRequest } from '../requests/users/user-create.request';
import * as bcrypt from 'bcrypt';
import { rename } from 'fs';
import { UserUpdateRequest } from '../requests/users/user-update.request';

@Injectable()
export class UserService extends CrudService<UserModel> {
  constructor(
    @InjectModel(UserModel)
    protected model: typeof UserModel
  ) {
    super();
  }

  public async create(
    attrs: UserCreateRequest
  ): Promise<UserModel> {
    const user = new UserModel();
    user.name = attrs.name;
    user.email = attrs.email;
    user.password = await bcrypt.hash(attrs.password, 10);
    await user.save();
    return user;
  }

  public async update(
    id: string,
    attrs: UserUpdateRequest
  ): Promise<UserModel> {
    const user = await this.findById(id);
    user.name = attrs.name;
    user.email = attrs.email;
    await user.save();
    return user;
  }

  public async getAll(
    request: Request
  ): Promise<PaginationResponse<UserResponse>> {
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
    const entities = data.rows.map(row => new UserResponse(row));
    return this.paginateResponse([entities, data.count], request);
  }

  public async findCurrentUser(
    id: string
  ): Promise<UserModel> {
    return this.model.findOne({
      where: {id},
    });
  }

  public async changeAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<UserModel> {
    const user = await this.findById(userId);

    let ext = 'jpg';
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = 'jpeg';
        break;
      case 'image/png':
        ext = 'png';
        break;
      default:
        break;
    }
    const avatarPath = `uploads/avatars/${userId}.${ext}`;
    rename(file.path, 'public/' + avatarPath, err => console.log(err));

    // user.avatar_url = avatarPath;email_confirmed_at
    await user.save();

    return user;
  }
}
