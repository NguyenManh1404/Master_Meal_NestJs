import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import * as sequelize from "sequelize";
import AdminModel from "./admin.model";

@Table({
  tableName: "industries",
  timestamps: true,
})
export default class IndustriesModel extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @ForeignKey(() => AdminModel)
  @Column({
    type: sequelize.UUID,
    allowNull: true,
  })
  public admin_id: string;

  @Column({
    type: sequelize.STRING(255),
    allowNull: true,
  })
  public industry_name: string;

  @CreatedAt
  public created_at: Date | null;

  @UpdatedAt
  public updated_at: Date | null;

  @DeletedAt
  public deleted_at: Date | null;

  @BelongsTo(() => AdminModel, {
    keyType: sequelize.UUID,
    foreignKey: 'admin_id',
    constraints: false,
  })
  public admin: AdminModel;
}
