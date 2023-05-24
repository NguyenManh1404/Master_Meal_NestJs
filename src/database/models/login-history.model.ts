import {Column, CreatedAt, Model, Table} from 'sequelize-typescript';
import * as sequelize from 'sequelize';

@Table({
  tableName: 'login_histories',
  timestamps: true,
  updatedAt: false,
})
export default class LoginHistoryModel extends Model {
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
  public model_type: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  public model_id: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  public login_ip: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  public user_agent: string;

  @CreatedAt
  public created_at: Date | null;
}
