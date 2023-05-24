import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from '../../services/auth.service';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {createTestUser, destroyTestUser} from '../libs/auth-helper';
import {plainToInstance} from 'class-transformer';
import {RegisterRequest} from '../../requests/users/register.request';
import {validate} from 'class-validator';

describe('IsUniqueTesting', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('is-unique validation testing', async () => {
    const testUser = await createTestUser(authService, 'testemail@gmail.com');
    const registerInput = plainToInstance(RegisterRequest, {email: 'testemail@gmail.com'});
    const errors = await validate(registerInput, {skipMissingProperties: true});
    expect(errors.length).not.toBe(0);
    expect(errors[0].constraints.hasOwnProperty('UniqueValidatorConstrain')).toEqual(true);
    await destroyTestUser(testUser);
  }, 30000);
});
