import { v4 as uuidv4, v4 } from 'uuid';
import * as moment from 'moment';
import { faker } from '@faker-js/faker';
import UserModel from '../models/user.model';
import * as bcrypt from 'bcrypt';
import TokenModel from '../models/token.model';
import { TokenTypes } from '../../common/constants/token.const';
import { JwtService } from '@nestjs/jwt';
import AdminModel from '../models/admin.model';

export default class ModelFactory {
  public static async createAdmin(): Promise<AdminModel> {
    const hashPassword = bcrypt.hashSync('1234', 10);
    const admin = new AdminModel();
    admin.id = uuidv4();
    admin.email = faker.internet.email();
    admin.name = faker.name.fullName();
    admin.password = hashPassword;
    admin.created_at = faker.date.recent();
    return admin;
  }

  public static async createUser(): Promise<UserModel> {
    const hashPassword = bcrypt.hashSync('1234', 10);
    const user = new UserModel();
    user.id = uuidv4();
    user.email = faker.internet.email();
    user.name = faker.name.fullName();
    user.password = hashPassword;
    user.created_at = faker.date.recent();
    return user;
  }

  public static async createBearerToken(
    jwtService: JwtService,
    fakeUser: UserModel | AdminModel,
    modelType?: string
  ): Promise<TokenModel> {
    const fakeToken = new TokenModel();
    fakeToken.id = uuidv4();
    fakeToken.model_type = modelType || 'UserModel';
    fakeToken.model_id = fakeUser.id;
    fakeToken.token_type = TokenTypes.BEARER;
    fakeToken.token_value = jwtService.sign({
      id: fakeUser.id,
      email: fakeUser.email,
      type: modelType === 'UserModel' ? 'user' : 'admin',
    });

    return fakeToken;
  }

  public static async createResetPasswordToken(
    fakeUser: UserModel | AdminModel,
    modelType?: string
  ): Promise<TokenModel> {
    const fakeToken = new TokenModel();
    fakeToken.id = uuidv4();
    fakeToken.model_type = modelType || 'UserModel';
    fakeToken.model_id = fakeUser.id;
    fakeToken.token_type = TokenTypes.RESET_PASSWORD;
    fakeToken.token_value = 'fakeToken';

    return fakeToken;
  }
}
