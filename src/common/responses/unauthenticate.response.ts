import {ApiProperty} from '@nestjs/swagger';

export class UnauthenticatedResponseSchema {
  @ApiProperty({
    default: 401,
  })
  public status: number;

  @ApiProperty({
    default: 'Unauthenticated.',
  })
  public message: string;
}
