import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminService } from '../../services/auth-admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import LoginHistoryModel from '../../../database/models/login-history.model';
import { DatabaseModule } from '../../../database/database.module';
import { GlobalConfigModule } from '../../../configs/config.module';
import TokenModel from '../../../database/models/token.model';
import { TokenTypes } from '../../../common/constants/token.const';
import { NotFoundError } from '../../../common/errors/not-found.error';
import AdminModel from '../../../database/models/admin.model';
import {
  createTestAdmin,
  destroyTestAdmin,
} from '../libs/auth-helper';
import {AdminService} from '../../services/admin.service';

describe('AuthAdminService', () => {
  let authAdminService: AuthAdminService
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalConfigModule,
        DatabaseModule,
        SequelizeModule.forFeature([AdminModel, LoginHistoryModel, TokenModel]),
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRATION,
          },
        }),
      ],
      providers: [AuthAdminService, AdminService],
    }).compile();

    authAdminService = module.get<AuthAdminService>(AuthAdminService);
    adminService = module.get<AdminService>(AdminService);
  });

  it('Test validateAdmin function fail', async () => {
    const expected = await authAdminService.validateAdmin(
      'testuyser@mailabc.com',
      '1234'
    );
    expect(expected).toStrictEqual(null);
  });

  it('Test validateAdmin function with wrong password', async () => {
    const admin = await createTestAdmin(adminService, 'testemail@gmail.com');
    const expected = await authAdminService.validateAdmin(
      admin.email,
      'wrong_password'
    );
    expect(expected).toStrictEqual(null);
    await destroyTestAdmin(admin);
  });

  it('Test validateAdmin function success', async () => {
    const exitedAdmin = await AdminModel.findOne({
      where: { email: 'gaumapdev@gmail.com' },
    });
    const expected = await authAdminService.validateAdmin(
      'gaumapdev@gmail.com',
      '1234'
    );
    expect(expected).toStrictEqual(exitedAdmin);
  });

  it('Test revokeAllBearerTokens function', async () => {
    const admin = await createTestAdmin(adminService, 'testemail@gmail.com');
    const expected = await authAdminService.createBearerToken(admin);
    expect(typeof expected).toBe('string');

    const tokenCountBefore = await TokenModel.count({
      where: {
        model_type: 'AdminModel',
        token_type: TokenTypes.BEARER,
        model_id: admin.id,
      },
    });
    expect(tokenCountBefore).toBeGreaterThan(0);
    await authAdminService.revokeAllBearerTokens(admin);

    const tokenCountAfter = await TokenModel.count({
      where: {
        model_type: 'AdminModel',
        token_type: TokenTypes.BEARER,
        model_id: admin.id,
      },
    });
    expect(tokenCountAfter).toEqual(0);
    await destroyTestAdmin(admin);
  });

  it('Test updatePasswordUsingToken with wrong token', async () => {
    try {
      await authAdminService.updatePasswordUsingToken({
        token: 'wrong_token',
        password: '1234',
        password_confirmation: '1234',
      });
    } catch (err: any) {
      const notFound = err as NotFoundError;
      expect(notFound.getStatus()).toEqual(404);
    }
  });
});
