import {Test, TestingModule} from '@nestjs/testing';
import UserModel from '../../../database/models/user.model';
import {UserService} from '../../services/user.service';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {Response} from 'supertest';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import ModelFactory from '../../../database/factories/model.factory';
import {JwtService} from '@nestjs/jwt';
import {AdminService} from '../../services/admin.service';
import {authAdminMocking, authUserMocking} from '../libs/auth-helper';

describe('UserControllerTest', () => {
  let app: INestApplication;
  let userService: UserService;
  let adminService: AdminService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Test get list users with pagination status code 401', async () => {
    return request(app.getHttpServer())
      .get('/users?limit=5')
      .expect(401);
  });

  it('Test get list users with pagination status code 200', async () => {
    const {bearerToken} = await authUserMocking(userService, jwtService);

    const fakeUsers: UserModel[] = [];
    for (let i = 0; i < 5; i++) {
      fakeUsers.push(await ModelFactory.createUser());
    }
    jest.spyOn(userService, 'getByQueryParams').mockReturnValue(Promise.resolve({
      rows: fakeUsers,
      count: 100,
    }));
    return request(app.getHttpServer())
      .get('/users?limit=5')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.length).toEqual(5);
      });
  });

  it('Test get user detail status code 404', async () => {
    const {bearerToken} = await authUserMocking(userService, jwtService);
    return request(app.getHttpServer())
      .get(`/users/anotherId`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(404);
  });

  it('Test get user detail status code 200', async () => {
    const {bearerToken} = await authUserMocking(userService, jwtService);

    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(userService, 'findById').mockReturnValue(Promise.resolve(fakeUser));

    return request(app.getHttpServer())
      .get(`/users/${fakeUser.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.id).toEqual(fakeUser.id);
      });
  });

  it('Test create user status code 403', async () => {
    const {bearerToken} = await authUserMocking(userService, jwtService);
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({})
      .expect(403);
  });

  it('Test create user status code 422', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send()
      .expect(422);
  });

  it('Test create user status code 201', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);

    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(userService, 'create').mockReturnValue(Promise.resolve(fakeUser));
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        name: fakeUser.name,
        email: fakeUser.email,
        gender: 0,
        birthday: '2000-01-01',
        password: 'StrongPassword123!@#',
        password_confirmation: 'StrongPassword123!@#',
      })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body.data.name).toEqual(fakeUser.name);
        expect(res.body.data.email).toEqual(fakeUser.email);
      });
  });

  it('Test update user status code 403', async () => {
    const {bearerToken} = await authUserMocking(userService, jwtService);
    const fakeUser = await ModelFactory.createUser();
    return request(app.getHttpServer())
      .put(`/users/${fakeUser.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send()
      .expect(403);
  });

  it('Test update user status code 404', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);
    return request(app.getHttpServer())
      .put(`/users/anotherId`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send()
      .expect(404);
  });

  it('Test update user status code 422', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);
    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(userService, 'findById').mockReturnValue(Promise.resolve(fakeUser));
    return request(app.getHttpServer())
      .put(`/users/${fakeUser.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        email: 'wrongEmail',
      })
      .expect(422);
  });

  it('Test update user status code 200', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);

    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(userService, 'findById').mockReturnValue(Promise.resolve(fakeUser));

    fakeUser.name = 'Test update name';
    jest.spyOn(userService, 'update').mockReturnValue(Promise.resolve(fakeUser));

    return request(app.getHttpServer())
      .put(`/users/${fakeUser.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        name: 'Test update name',
      })
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.name).toEqual('Test update name');
      });
  });

  it('Test delete user status code 403', async () => {
    const {bearerToken} = await authUserMocking(userService, jwtService);
    const fakeUser = await ModelFactory.createUser();
    return request(app.getHttpServer())
      .delete(`/users/${fakeUser.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send()
      .expect(403);
  });

  it('Test delete user status code 404', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);
    return request(app.getHttpServer())
      .delete(`/users/anotherid`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send()
      .expect(404);
  });

  it('Test delete user status code 200', async () => {
    const {bearerToken} = await authAdminMocking(adminService, jwtService);

    const fakeUser = await ModelFactory.createUser();
    jest.spyOn(userService, 'findById').mockReturnValue(Promise.resolve(fakeUser));
    jest.spyOn(userService, 'delete').mockReturnValue(Promise.resolve(true));

    return request(app.getHttpServer())
      .delete(`/users/${fakeUser.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send()
      .expect(200);
  });
});
