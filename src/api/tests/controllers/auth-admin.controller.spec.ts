import {Test, TestingModule} from '@nestjs/testing';
import {isApiResponseErrorWithStatus} from '../../../common/responses/common-error.response';
import {AuthAdminController} from '../../controllers/auth-admin.controller';
import AdminModel from '../../../database/models/admin.model';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import {INestApplication} from '@nestjs/common';
import ModelFactory from '../../../database/factories/model.factory';
import {AuthAdminService} from '../../services/auth-admin.service';
import {JwtService} from '@nestjs/jwt';

describe('AuthAdminControllerTest', () => {
  let fakeAdmin: AdminModel;
  let app: INestApplication;
  let authAdminController: AuthAdminController;
  let authAdminService: AuthAdminService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);
    authAdminController = app.get<AuthAdminController>(AuthAdminController);
    authAdminService = app.get<AuthAdminService>(AuthAdminService);
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    fakeAdmin = await ModelFactory.createAdmin();
    const bearerToken = await ModelFactory.createBearerToken(jwtService, fakeAdmin, 'AdminModel');
    jest.spyOn(authAdminService, 'validateAdmin').mockReturnValue(Promise.resolve(fakeAdmin));
    jest.spyOn(authAdminService, 'createBearerToken').mockReturnValue(Promise.resolve(bearerToken.token_value));
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Test login function with wrong credential.', async () => {
    try {
      await authAdminController.login({
        email: fakeAdmin.email,
        password: '1234',
      });
    } catch (error) {
      expect(isApiResponseErrorWithStatus(error, 401)).toEqual(true);
    }
  });
});
