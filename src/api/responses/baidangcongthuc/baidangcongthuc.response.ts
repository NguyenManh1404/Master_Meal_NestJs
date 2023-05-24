import { ApiProperty } from '@nestjs/swagger';
import moment = require('moment');
import { DefaultFormat } from '../../../common/constants/format.const';
import UserModel from '../../../database/models/user.model';
import FollowerModel from '../../../database/models/follower.model';
import FavoriteModel from '../../../database/models/favorite.model';
import BaiDangCongThucModel from '../../../database/models/baidangcongthuc.model';

export class BaiDangCongThucResponse {
  @ApiProperty({
    description: 'Bai Dang Cong Thuc Id',
  })
  public id: string;

  @ApiProperty({
    description: 'Ten bai dang',
  })
  public ten_bai_dang: string;

  @ApiProperty({
    description: 'Thoi gian nau',
  })
  public thoi_gian_nau: number;

  @ApiProperty({
    description: 'Cac buoc',
  })
  public cac_buoc: string;

  @ApiProperty({
    description: 'URL video',
  })
  public url_video: string;

  @ApiProperty({
    default: '2000-01-01 00:00:00',
  })
  public created_at: string | null;

  @ApiProperty()
  public user_id: string;

  @ApiProperty()
  public user: UserModel;

  constructor(baidangcongthuc: BaiDangCongThucModel) {
    this.id = baidangcongthuc.id;
    this.ten_bai_dang = baidangcongthuc.ten_bai_dang;
    this.thoi_gian_nau = baidangcongthuc.thoi_gian_nau;
    this.cac_buoc = baidangcongthuc.cac_buoc;
    this.url_video = baidangcongthuc.url_video;
    this.user_id = baidangcongthuc.user_id
    this.user = baidangcongthuc.user;
    this.created_at = !baidangcongthuc.created_at
      ? null
      : moment(baidangcongthuc.created_at).format(DefaultFormat.DATETIME);
  }
}
