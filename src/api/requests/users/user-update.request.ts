import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsInt, IsNotEmpty, IsString, MaxLength, ValidateIf} from 'class-validator';
import {IsDateString} from '../../../common/validators/is-date-string';

export class UserUpdateRequest {
  @ApiProperty()
  @ValidateIf((object, value) => !!value)
  @IsString()
  @MaxLength(150)
  public name: string;

  @ApiProperty()
  @ValidateIf((object, value) => !!value)
  @IsString()
  @IsEmail()
  @MaxLength(150)
  public email: string;

  @ApiProperty()
  @ValidateIf((object, value) => !!value)
  public gender: string;

  @ApiProperty({
    type: 'string',
    default: '2000-01-01',
  })
  @ValidateIf((object, value) => !!value)
  @IsDateString()
  public date_of_birth: string;
}
