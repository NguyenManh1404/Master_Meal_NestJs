import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {IsExist} from '../../../common/validators/is-exist';
import TokenModel from '../../../database/models/token.model';
import {IsEqualTo} from '../../../common/validators/is-equal-to';

export class UpdatePasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsExist({
    entityClass: TokenModel,
    columnName: 'token_value',
  })
  public token: string;

  @ApiProperty({
    default: 'your new secret password.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Your password is too weak.'})
  public password: string;

  @ApiProperty({
    default: 'same as password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @IsEqualTo<UpdatePasswordInput>('password')
  public password_confirmation: string;
}
