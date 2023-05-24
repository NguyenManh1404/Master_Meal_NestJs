import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from '../../controllers/auth.controller';
import {isApiResponseStatus200} from '../../../common/responses/200.response';
import {isApiResponseErrorWithStatus} from '../../../common/responses/common-error.response';
import {AuthService} from '../../services/auth.service';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import {INestApplication} from '@nestjs/common';
import ModelFactory from '../../../database/factories/model.factory';
import {MailService} from '../../../mail/services/mail.service';
import {UserService} from '../../services/user.service';
import * as request from 'supertest';
import {JwtService} from '@nestjs/jwt';

const testEmail = 'triet.nguyen207@gmail.com';

describe('AuthControllerTest', () => {
  let app: INestApplication;
  let authController: AuthController;
  let authService: AuthService;
  let mailService: MailService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('Test register function.', async () => {
    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(authService, 'registerUser').mockReturnValue(Promise.resolve(fakeUser));
    jest.spyOn(mailService, 'sendUserConfirmation').mockImplementation(async () => true);
    const registerUser = await authController.register({
      email: testEmail,
      name: 'New User',
      password: '1234',
      password_confirmation: '1234',
    });
    expect(registerUser.data.name).toEqual(fakeUser.name);
    expect(registerUser.data.email).toEqual(fakeUser.email);
  }, 30000);

  it('Test login function with wrong credential.', async () => {
    try {
      await authController.login({
        email: 'testemail@gmail.com',
        password: 'wrongpassword',
      });
    } catch (error) {
      expect(isApiResponseErrorWithStatus(error, 401)).toEqual(true);
    }
  });

  it('Test login function with true credential.', async () => {
    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(authService, 'validateUser').mockReturnValue(Promise.resolve(fakeUser));
    jest.spyOn(authService, 'createBearerToken').mockReturnValue(Promise.resolve('fakeBearerToken'));

    const result: any = await authController.login({
      email: testEmail,
      password: '1234',
    });
    expect(isApiResponseStatus200(result)).toEqual(true);
    expect(result.data.access_token).toEqual('fakeBearerToken');
  }, 30000);

  it('Test logout function.', async () => {
    const fakeUser = await ModelFactory.createUser();
    const token = await ModelFactory.createBearerToken(jwtService, fakeUser);
    jest.spyOn(userService, 'findCurrentUser').mockReturnValue(Promise.resolve(fakeUser));
    jest.spyOn(authService, 'revokeAllBearerTokens').mockReturnValue(Promise.resolve(true));

    return request(app.getHttpServer())
      .post('/account/logout')
      .set('Authorization', `Bearer ${token.token_value}`)
      .expect(204);
  });

  it('Test request reset password function.', async () => {
    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(userService, 'findBy').mockReturnValue(Promise.resolve(fakeUser));
    jest.spyOn(mailService, 'sendRequestNewPassword').mockImplementation(async () => true);

    const result = await authController.resetPassword({email: fakeUser.email});
    expect(isApiResponseStatus200(result)).toEqual(true);
  }, 30000);

  it('Test update password using token', async () => {
    const fakeUser = await ModelFactory.createUser();
    const token = await ModelFactory.createResetPasswordToken(fakeUser);
    jest.spyOn(authService, 'findByResetPasswordToken').mockReturnValue(Promise.resolve(fakeUser));

    const updatePasswordResult = await authController.updateNewPassword({
      token: token.token_value,
      password: 'abc123!@#',
      password_confirmation: 'abc123!@#',
    });
    expect(isApiResponseStatus200(updatePasswordResult)).toEqual(true);
  }, 30000);
});
