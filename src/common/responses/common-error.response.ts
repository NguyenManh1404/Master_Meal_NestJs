import {HttpException} from '@nestjs/common';
export class ApiError extends HttpException {
  constructor(responseStatus: number, responseMessage: string) {
    super(
      {
        status: responseStatus,
        message: responseMessage,
      },
      responseStatus
    );
  }
}

export const isApiResponseErrorWithStatus = (response: any, status: number): response is ApiError => {
  return (response as ApiError).getStatus() === status;
};
