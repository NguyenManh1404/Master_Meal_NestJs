import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from '../../services/auth.service';
import UserModel from '../../../database/models/user.model';
import TokenModel from '../../../database/models/token.model';
import {TokenTypes} from '../../../common/constants/token.const';
import {NotFoundError} from '../../../common/errors/not-found.error';
import {createTestUser, destroyTestUser} from '../libs/auth-helper';
import {plainToInstance} from 'class-transformer';
import {RegisterRequest} from '../../requests/users/register.request';
import {validate} from 'class-validator';
import {UpdatePasswordInput} from '../../requests/users/update-password.input';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import {INestApplication} from '@nestjs/common';

describe('AuthService', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('Test validateUser function fail', async () => {
    const expected = await authService.validateUser('testuyser@mailabc.com', '1234');
    expect(expected).toStrictEqual(null);
  });

  it('Test validateUser function with wrong password', async () => {
    const user = await createTestUser(authService, 'testemail@gmail.com');
    const expected = await authService.validateUser('testemail@gmail.com', 'wrong_password');
    expect(expected).toStrictEqual(null);
    await destroyTestUser(user);
  });

  it('Test validateUser function success', async () => {
    const exitedUser = await UserModel.findOne({where: {email: 'gaumapdev@gmail.com'}});
    const expected = await authService.validateUser('gaumapdev@gmail.com', '1234');
    expect(expected).toStrictEqual(exitedUser);
  });

  it('Test revokeAllBearerTokens function', async () => {
    const user = await createTestUser(authService, 'testemail@gmail.com');
    const expected = await authService.createBearerToken(user);
    expect(typeof expected).toBe('string');

    const tokenCountBefore = await TokenModel.count({
      where: {
        model_type: 'UserModel',
        token_type: TokenTypes.BEARER,
        model_id: user.id,
      },
    });
    expect(tokenCountBefore).toBeGreaterThan(0);
    await authService.revokeAllBearerTokens(user);

    const tokenCountAfter = await TokenModel.count({
      where: {
        model_type: 'UserModel',
        token_type: TokenTypes.BEARER,
        model_id: user.id,
      },
    });
    expect(tokenCountAfter).toEqual(0);
    await destroyTestUser(user);
  });

  it('Test updatePasswordUsingToken with wrong token', async () => {
    try {
      await authService.updatePasswordUsingToken({
        token: 'wrong_token',
        password: '1234',
        password_confirmation: '1234',
      });
    } catch (err: any) {
      const notFound = err as NotFoundError;
      expect(notFound.getStatus()).toEqual(404);
    }
  });

  it('is-equal-to validation testing', async () => {
    const registerInput = plainToInstance(RegisterRequest, {password: 'Abcd123!@#', password_confirmation: 'Abcd!@#'});
    const errors = await validate(registerInput, {skipMissingProperties: true});
    expect(errors.length).not.toBe(0);
    expect(errors[0].constraints.hasOwnProperty('IsEqualTo')).toEqual(true);
  }, 30000);

  it('is-exist validation testing', async () => {
    const testUser = await createTestUser(authService, 'testemail@gmail.com');
    await TokenModel.create({
      model_type: 'UserModel',
      model_id: testUser.id,
      token_type: TokenTypes.RESET_PASSWORD,
      token_value: 'test-token',
      created_at: new Date(),
    });
    const updatePasswordInput = plainToInstance(UpdatePasswordInput, {token: 'wrong-test-token'});
    const errors = await validate(updatePasswordInput, {skipMissingProperties: true});
    expect(errors.length).not.toBe(0);
    expect(errors[0].constraints.hasOwnProperty('CheckExistValidatorConstrain')).toEqual(true);
    await destroyTestUser(testUser);
  }, 30000);
});
