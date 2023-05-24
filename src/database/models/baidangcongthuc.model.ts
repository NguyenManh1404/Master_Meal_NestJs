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

@Table({
  tableName: 'bai_dang_cong_thuc',
  timestamps: true,
  updatedAt: false,
})
export default class BaiDangCongThucModel extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: sequelize.UUID,
    allowNull: true,
  })
  public user_id: string;

  @Column({
    type: sequelize.STRING(255),
    allowNull: true,
  })
  public ten_bai_dang: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  public thoi_gian_nau: number;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public cac_buoc: string;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public url_video: string;

  @CreatedAt
  public created_at: Date | null;

  @BelongsTo(() => UserModel, {
    keyType: sequelize.UUID,
    foreignKey: 'user_id',
    constraints: false,
  })
  public user: UserModel;
}
