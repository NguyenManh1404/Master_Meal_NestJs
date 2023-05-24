import { ApiProperty } from '@nestjs/swagger';
import moment = require('moment');
import { DefaultFormat } from '../../../common/constants/format.const';
import NguyenLieuModel from '../../../database/models/nguyenlieu.model';
import BaiDangCongThucModel from '../../../database/models/baidangcongthuc.model';

export class NguyenLieuResponse {
  @ApiProperty({
    description: 'Nguyen Lieu Id',
  })
  public id: string;

  @ApiProperty({
    description: 'Ten nguyen lieu',
  })
  public ten_nguyen_lieu: string;

  @ApiProperty({
    description: 'So luong',
  })
  public so_luong: number;

  @ApiProperty({
    default: '2000-01-01 00:00:00',
  })
  public created_at: string | null;

  @ApiProperty()
  public id_baidangcongthuc: string;

  @ApiProperty()
  public bai_dang_cong_thuc: BaiDangCongThucModel;

  constructor(nguyenlieu: NguyenLieuModel) {
    this.id = nguyenlieu.id;
    this.ten_nguyen_lieu = nguyenlieu.ten_nguyen_lieu;
    this.so_luong = nguyenlieu.so_luong;
    this.id_baidangcongthuc = nguyenlieu.id_baidangcongthuc;
    this.bai_dang_cong_thuc = nguyenlieu.bai_dang_cong_thuc;
    this.created_at = !nguyenlieu.created_at
      ? null
      : moment(nguyenlieu.created_at).format(DefaultFormat.DATETIME);
  }
}
