import { ApiProperty } from '@nestjs/swagger';
import moment = require('moment');
import { DefaultFormat } from '../../../common/constants/format.const';
import UserModel from '../../../database/models/user.model';
import FollowerModel from '../../../database/models/follower.model';
import FavoriteModel from '../../../database/models/favorite.model';

export class FavoriteResponse {
  @ApiProperty({
    description: 'Favorite Id',
  })
  public id: string;

  @ApiProperty({
    description: 'Status',
    default: 0,
  })
  public trangthai: number;

  @ApiProperty({
    default: '2000-01-01 00:00:00',
  })
  public created_at: string | null;

  @ApiProperty()
  public user_id: string;

  @ApiProperty()
  public id_baidangcongthuc: string;

  @ApiProperty()
  public users: UserModel[];

  constructor(favorite: FavoriteModel) {
    this.id = favorite.id;
    this.id_baidangcongthuc = favorite.id_baidangcongthuc;
    this.trangthai = favorite.trangthai;
    this.created_at = !favorite.created_at
      ? null
      : moment(favorite.created_at).format(DefaultFormat.DATETIME);
  }
}
