import {ApiProperty} from '@nestjs/swagger';
import {IsString, ValidateIf} from 'class-validator';

export class AdminUpdateRequest {
  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => !!value)
  public name: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => !!value)
  public email: string;
}
