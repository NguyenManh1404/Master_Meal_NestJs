import {Test, TestingModule} from '@nestjs/testing';
import {AccountController} from '../../controllers/account.controller';
import TokenModel from '../../../database/models/token.model';
import {AuthService} from '../../services/auth.service';
import {isApiResponseStatus200} from '../../../common/responses/200.response';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {UserService} from '../../services/user.service';
import ModelFactory from '../../../database/factories/model.factory';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import {JwtService} from '@nestjs/jwt';
import UserModel from '../../../database/models/user.model';

describe('AccountControllerTest', () => {
  let controller: AccountController;
  let authService: AuthService;
  let app: INestApplication;
  let bearerToken: TokenModel;
  let userService: UserService;
  let jwtService: JwtService;
  let fakeUser: UserModel;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);

    controller = module.get<AccountController>(AccountController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    fakeUser = await ModelFactory.createUser();
    bearerToken = await ModelFactory.createBearerToken(jwtService, fakeUser);
    jest.spyOn(userService, 'findCurrentUser').mockReturnValue(Promise.resolve(fakeUser));
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('Test get profile', async () => {
    const result = await controller.getProfile({user: fakeUser});
    expect(isApiResponseStatus200(result)).toEqual(true);
    expect(result.data.id).toEqual(fakeUser.id);
  });

  it('Test get profile using JWT', async () => {
    return request(app.getHttpServer())
      .get('/account/profile')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.id).toEqual(fakeUser.id);
      });
  });

  it('Test update profile', async () => {
    const updatedData = await ModelFactory.createUser();
    updatedData.email = 'newEmail@email.com';
    updatedData.name = 'newName';
    jest.spyOn(userService, 'update').mockReturnValue(Promise.resolve(updatedData));

    const result = await controller.updateProfile({
      name: updatedData.name,
      email: updatedData.email,
      birthday: '2022-01-01',
    }, {
      user: {
        type: 'user',
        attributes: fakeUser.dataValues,
      },
    });
    expect(isApiResponseStatus200(result)).toEqual(true);
    expect(result.data.name).toEqual(updatedData.name);
    expect(result.data.email).toEqual(updatedData.email);
  });

  it('Test update profile with validation failed', async () => {
    const token = await authService.createBearerToken(fakeUser);
    return request(app.getHttpServer())
      .post('/account/profile')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Edit name',
        email: 'invalid_email',
        birthday: 'invalid_date',
      })
      .expect(422);
  });
});
