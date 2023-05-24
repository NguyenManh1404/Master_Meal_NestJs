import {Column, CreatedAt, Model, Table} from 'sequelize-typescript';
import * as sequelize from 'sequelize';

@Table({
  tableName: 'tokens',
  timestamps: true,
  updatedAt: false,
})
export default class TokenModel extends Model {
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
    type: sequelize.INTEGER,
    allowNull: false,
  })
  public token_type: number;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  public token_value: string;

  @CreatedAt
  public created_at: Date | null;
}
