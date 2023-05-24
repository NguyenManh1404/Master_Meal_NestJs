import {ApiProperty} from '@nestjs/swagger';
import AdminModel from '../../../database/models/admin.model';
import * as moment from 'moment';
import {DefaultFormat} from '../../../common/constants/format.const';

export class AdminResponse {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public failed_attempts: number;

  @ApiProperty()
  public note: string;

  @ApiProperty()
  public locked_at: string | null;

  @ApiProperty()
  public created_at: string | null;

  constructor(admin: AdminModel) {
    this.id = admin.id;
    this.email = admin.email;
    this.name = admin.name;
    this.created_at = admin.created_at ? moment(admin.created_at).format(DefaultFormat.DATETIME) : null;
  }
}
