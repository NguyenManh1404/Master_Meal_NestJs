import { ApiProperty } from '@nestjs/swagger';
import UserModel from '../../../database/models/user.model';
import * as moment from 'moment';

export class ProfileResponse {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public phone: string;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.name = userModel.name;
    this.email = userModel.email;
    this.phone = userModel.phone;
  }
}
