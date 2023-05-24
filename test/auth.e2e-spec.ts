import {Test, TestingModule} from '@nestjs/testing';
import {BadRequestException, INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {ValidationError} from 'class-validator';
import {BadRequestExceptionFilter} from '../src/common/exception-filters/bad-request-exception.filter';
import {SequelizeModule} from '@nestjs/sequelize';
import UserModel from '../src/database/models/user.model';
import LoginHistoryModel from '../src/database/models/login-history.model';
import TokenModel from '../src/database/models/token.model';
import {GlobalConfigModule} from '../src/configs/config.module';
import {DatabaseModule} from '../src/database/database.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalConfigModule,
        DatabaseModule,
        SequelizeModule.forFeature([
          UserModel,
          LoginHistoryModel,
          TokenModel,
        ]),
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory(errors: ValidationError[]): any {
        return new BadRequestException(errors);
      },
    }));
    app.useGlobalFilters(new BadRequestExceptionFilter());
    await app.init();
  });

  it('Login with empty email and password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .expect(422);
  });

  it('Login with wrong email or password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({email: 'test@mail.com', password: 'wrongpassword'})
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid email or password');
      });
  });

  it('Login with match email or password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({email: 'gaumapdev@gmail.com', password: '1234'})
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.access_token).toBeDefined();
      });
  });
});
