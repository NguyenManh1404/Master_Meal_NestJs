import {Controller, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

@Controller()
@ApiTags('Health Check')
export class AppController {
  @Get()
  public async getHello(): Promise<any> {
    return {
      success: true,
      message: 'API Worked!',
    };
  }
}
