import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class FollowerCreateRequest {
  @ApiProperty({
    description: "User Id Follow",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public follower_nguoidung_id: string;

  @ApiProperty({
    description: 'User',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public user_id: string;
}
