import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppModule} from './app.module';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRATION,
          },
        }),
        AppModule
      ],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await appController.getHello()).toStrictEqual({
        success: true,
        message: 'API Worked!',
      });
    }, 30000);
  });
});
