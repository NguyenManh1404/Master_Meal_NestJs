import { ApiProperty } from '@nestjs/swagger';
import moment = require('moment');
import { DefaultFormat } from '../../../common/constants/format.const';
import UserModel from '../../../database/models/user.model';
import FollowerModel from '../../../database/models/follower.model';

export class FollowerResponse {
  @ApiProperty({
    description: 'Area Id',
  })
  public id: string;

  @ApiProperty({
    description: 'Area Name',
    default: null,
  })
  public area_name: string;

  @ApiProperty({
    default: '2000-01-01 00:00:00',
  })
  public created_at: string | null;

  @ApiProperty()
  public user_id: string;

  @ApiProperty()
  public follower_nguoidung_id: string;

  @ApiProperty()
  public users: UserModel[];

  constructor(follower: FollowerModel) {
    this.id = follower.id;
    this.follower_nguoidung_id = follower.follower_nguoidung_id;
    this.created_at = !follower.created_at
      ? null
      : moment(follower.created_at).format(DefaultFormat.DATETIME);
  }
}
