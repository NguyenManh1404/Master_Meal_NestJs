import {HttpException, HttpStatus} from '@nestjs/common';

export class NotFoundError extends HttpException {
  constructor(protected error: any) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      },
      HttpStatus.NOT_FOUND,
      {
        cause: error,
      }
    );
  }
}
