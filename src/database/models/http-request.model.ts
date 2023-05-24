import { BelongsTo, BelongsToMany, Column, CreatedAt, DeletedAt, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import UserModel from './user.model';

@Table({
  tableName: 'http_requests',
  timestamps: true,
  updatedAt: false,
  deletedAt: false,
})
export default class HttpRequestModel extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @Column({
    type: sequelize.TEXT,
    allowNull: true,
  })
  public method: string;

  @Column({
    type: sequelize.TEXT,
    allowNull: true,
  })
  public url: string;

  @Column({
    type: sequelize.TEXT,
    allowNull: true,
  })
  public request_ip: string;

  @Column({
    type: sequelize.TEXT,
    allowNull: true,
  })
  public request_body: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  public response_status: number;

  @Column({
    type: sequelize.TEXT,
    allowNull: true,
  })
  public response_body: string;

  @Column({
    type: sequelize.TEXT,
    allowNull: true,
  })
  public error: string;

  @CreatedAt
  public created_at: Date | null;
}
