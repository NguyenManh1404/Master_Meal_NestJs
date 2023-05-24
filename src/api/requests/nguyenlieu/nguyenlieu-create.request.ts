import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class NguyenLieuCreateRequest {

  @ApiProperty({
    description: 'Ten nguyen lieu',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public ten_nguyen_lieu: string;

  @ApiProperty({
    description: 'So luong',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  public so_luong: number;

  @ApiProperty({
    description: 'Bai dang cong thuc',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public id_baidangcongthuc: string;


}
