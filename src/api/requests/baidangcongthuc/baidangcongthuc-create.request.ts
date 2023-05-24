import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class BaiDangCongThucCreateRequest {
  @ApiProperty({
    description: 'User',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public user_id: string;

  @ApiProperty({
    description: 'Ten bai dang',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public ten_bai_dang: string;

  @ApiProperty({
    description: 'Thoi gian nau',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  public thoi_gian_nau: number;

  @ApiProperty({
    description: 'Thoi gian nau',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public cac_buoc: string;

  @ApiProperty({
    description: 'URL Video',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public url_video: string;
}
