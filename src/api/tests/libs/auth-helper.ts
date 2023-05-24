import UserModel from '../../../database/models/user.model';
import TokenModel from '../../../database/models/token.model';
import {AuthService} from '../../services/auth.service';
import LoginHistoryModel from '../../../database/models/login-history.model';
import AdminModel from '../../../database/models/admin.model';
import {AdminService} from '../../services/admin.service';
import ModelFactory from '../../../database/factories/model.factory';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../../services/user.service';

export const createTestUser = async (
  authService: AuthService,
  testEmail: string
): Promise<UserModel> => {
  return authService.registerUser({
    email: testEmail,
    name: 'New User',
    password: '1234',
    password_confirmation: '1234',
    gender: 0,
    date_of_birth: '2000-01-01',
  });
};

export const destroyTestUser = async (testUser: UserModel) => {
  if (!testUser) {
    return;
  }

  // Delete tokens of user
  const tokens = await TokenModel.findAll({where: {model_id: testUser.id}});
  for (const token of tokens) {
    await token.destroy({force: true});
  }

  // Delete login histories
  const loginHistories = await LoginHistoryModel.findAll({
    where: {model_id: testUser.id},
  });
  for (const loginHistory of loginHistories) {
    await loginHistory.destroy({force: true});
  }

  // delete test user
  await testUser.destroy({force: true});
};

export const createTestAdmin = async (
  adminService: AdminService,
  testEmail: string
) => {
  const admin = new AdminModel();
  admin.email = testEmail;
  admin.name = 'admin-test';
  admin.password = '1234';
  return await admin.save();
};

export const destroyTestAdmin = async (testAdmin: AdminModel) => {
  if (!testAdmin) {
    return;
  }

  // Delete tokens of user
  const tokens = await TokenModel.findAll({
    where: {model_id: testAdmin.id},
  });
  for (const token of tokens) {
    await token.destroy({force: true});
  }

  // Delete login histories
  const loginHistories = await LoginHistoryModel.findAll({
    where: {model_id: testAdmin.id},
  });
  for (const loginHistory of loginHistories) {
    await loginHistory.destroy({force: true});
  }

  // delete test user
  await testAdmin.destroy({force: true});
};

export const authUserMocking = async (
  userService: UserService,
  jwtService: JwtService
): Promise<{ authUser: UserModel, bearerToken: TokenModel }> => {
  const authUser: UserModel = await ModelFactory.createUser();
  const bearerToken: TokenModel = await ModelFactory.createBearerToken(jwtService, authUser);
  jest.spyOn(userService, 'findCurrentUser').mockReturnValue(Promise.resolve(authUser));

  return {authUser, bearerToken};
};

export const authAdminMocking = async (
  adminService: AdminService,
  jwtService: JwtService
): Promise<{ authAdmin: AdminModel, bearerToken: TokenModel }> => {
  const adminModel: AdminModel = await ModelFactory.createUser();
  const bearerToken: TokenModel = await ModelFactory.createBearerToken(jwtService, adminModel, 'AdminModel');
  jest.spyOn(adminService, 'findCurrentAdmin').mockReturnValue(Promise.resolve(adminModel));

  return {authAdmin: adminModel, bearerToken};
};
