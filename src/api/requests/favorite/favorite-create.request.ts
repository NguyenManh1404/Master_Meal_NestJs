import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class FavoriteCreateRequest {
  @ApiProperty({
    description: 'Bai dang cong thuc',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public id_baidangcongthuc: string;

  @ApiProperty({
    description: 'User',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public user_id: string;

  @ApiProperty({
    description: 'Status',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  public trangthai: number;
}
