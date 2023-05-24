import {Column, CreatedAt, DeletedAt, HasMany, Model, Table, UpdatedAt} from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import LoginHistoryModel from './login-history.model';

@Table({
  tableName: 'admins',
  timestamps: true,
})
export default class AdminModel extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  public name: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  })
  public email: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  public password: string;

  @CreatedAt
  public created_at: Date | null;

  @UpdatedAt
  public updated_at: Date | null;

  @DeletedAt
  public deleted_at: Date | null;

  @HasMany(() => LoginHistoryModel, {
    foreignKey: 'model_id',
    constraints: false,
    scope: {
      model_type: 'AdminModel',
    },
  })
  public login_histories: LoginHistoryModel[];
}
