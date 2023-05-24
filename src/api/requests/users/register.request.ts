import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {IsUnique} from '../../../common/validators/is-unique';
import UserModel from '../../../database/models/user.model';
import {IsEqualTo} from '../../../common/validators/is-equal-to';
import {IsDateString} from '../../../common/validators/is-date-string';

export class RegisterRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(191)
  @IsUnique({
    entityClass: UserModel,
    columnName: 'email',
  })
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  public name: string;

  @ApiProperty({
    description: 'Gender of user (0: male | 1: female | 2: other)',
    default: 0,
  })
  @IsNotEmpty()
  @IsEnum([0, 1])
  public gender: number;

  @ApiProperty({
    default: '2000-01-01',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  public date_of_birth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Your password is too weak.'})
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEqualTo<RegisterRequest>('password')
  public password_confirmation: string;
}
