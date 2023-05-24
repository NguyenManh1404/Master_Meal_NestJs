import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import UserModel from './user.model';
import BaiDangCongThucModel from './baidangcongthuc.model';

@Table({
  tableName: 'nguyen_lieu',
  timestamps: true,
  updatedAt: false,
})
export default class NguyenLieuModel extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @ForeignKey(() => BaiDangCongThucModel)
  @Column({
    type: sequelize.UUID,
    allowNull: true,
  })
  public id_baidangcongthuc: string;

  @Column({
    type: sequelize.STRING(255),
    allowNull: true,
  })
  public ten_nguyen_lieu: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  public so_luong: number;

  @CreatedAt
  public created_at: Date | null;

  @BelongsTo(() => BaiDangCongThucModel, {
    keyType: sequelize.UUID,
    foreignKey: 'id_baidangcongthuc',
    constraints: false,
  })
  public bai_dang_cong_thuc: BaiDangCongThucModel;
}
