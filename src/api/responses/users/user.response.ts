import { ApiProperty } from '@nestjs/swagger';
import UserModel from '../../../database/models/user.model';
import * as moment from 'moment';
import { DefaultFormat } from '../../../common/constants/format.const';

export class UserResponse {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public so_bai_dang_cong_thuc: number;

  @ApiProperty()
  public url_video: string;

  @ApiProperty()
  public created_at?: string | null;

  constructor(user: UserModel) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.so_bai_dang_cong_thuc = user.so_bai_dang_cong_thuc;
    this.url_video = user.url_video;
    this.created_at = !user.created_at
      ? null
      : moment(user.created_at).format(DefaultFormat.DATETIME);
  }
}
