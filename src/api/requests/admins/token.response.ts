import {ApiProperty} from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty()
  public token_type: string;

  @ApiProperty()
  public access_token: string;

  @ApiProperty()
  public expires_in: number;
}
