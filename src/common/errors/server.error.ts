/* istanbul ignore file */
import {ApiProperty} from '@nestjs/swagger';

export class ServerErrorResponseSchema {
  @ApiProperty({
    default: 500,
  })
  public status: number;

  @ApiProperty({
    default: 'Server error.',
  })
  public message: string;
}
