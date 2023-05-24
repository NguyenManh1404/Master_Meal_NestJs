import { BelongsToMany, Column, CreatedAt, DeletedAt, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import TokenModel from './token.model';
import LoginHistoryModel from './login-history.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export default class UserModel extends Model {
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

  @Column({
    type: sequelize.STRING,
    allowNull: false,
    defaultValue: 'male',
  })
  public gender: string;

  @Column({
    type: sequelize.DATEONLY,
    allowNull: true,
  })
  public date_of_birth: Date | string | null;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public country_code: string | null;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public phone: string | null;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public introduction: string | null;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public nickname: string | null;

  @Column({
    type: sequelize.STRING,
    allowNull: true,
  })
  public address: string | null;

  @CreatedAt
  public created_at: Date | null;

  @UpdatedAt
  public updated_at: Date | null;

  @DeletedAt
  public deleted_at: Date | null;

  @HasMany(() => TokenModel, {
    foreignKey: 'model_id',
    constraints: false,
    scope: {
      model_type: 'UserModel',
      token_type: 1,
    },
  })
  public reset_password_tokens: TokenModel[];

  @HasMany(() => TokenModel, {
    foreignKey: 'model_id',
    constraints: false,
    scope: {
      model_type: 'UserModel',
      token_type: 2,
    },
  })
  public email_confirmation_tokens: TokenModel[];

  @HasMany(() => LoginHistoryModel, {
    foreignKey: 'model_id',
    constraints: false,
    scope: {
      model_type: 'UserModel',
    },
  })
  public login_histories: LoginHistoryModel[];

}
