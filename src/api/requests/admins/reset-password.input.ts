import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';
import {IsExist} from '../../../common/validators/is-exist';
import AdminModel from '../../../database/models/admin.model';

export class ResetPasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsExist({
    entityClass: AdminModel,
    columnName: 'email',
  })
  public email: string;
}
