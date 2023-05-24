import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {Response} from 'supertest';
import AdminModel from '../../../database/models/admin.model';
import {AdminService} from '../../services/admin.service';
import ModelFactory from '../../../database/factories/model.factory';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import {JwtService} from '@nestjs/jwt';
import TokenModel from '../../../database/models/token.model';

describe('AdminControllerTest', () => {
  let app: INestApplication;
  let adminService: AdminService;
  let fakeAdmin: AdminModel;
  let jwtService: JwtService;
  let bearerToken: TokenModel;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);

    adminService = module.get<AdminService>(AdminService);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    fakeAdmin = await ModelFactory.createAdmin();
    bearerToken = await ModelFactory.createBearerToken(jwtService, fakeAdmin, 'AdminModel');
    jest.spyOn(adminService, 'findCurrentAdmin').mockReturnValue(Promise.resolve(fakeAdmin));
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Test get list admins with pagination status code 200', async () => {
    const fakeAdmins: AdminModel[] = [];
    for (let i = 0; i < 5; i++) {
      fakeAdmins.push(await ModelFactory.createAdmin());
    }
    jest.spyOn(adminService, 'getByQueryParams').mockReturnValue(Promise.resolve({
      rows: fakeAdmins,
      count: 100,
    }));
    return request(app.getHttpServer())
      .get('/admins?limit=5')
      .set('Authorization', 'Bearer ' + bearerToken.token_value)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.length).toEqual(5);
      });
  });

  it('Test get user detail status code 200', async () => {
    const fakeAdmin = await ModelFactory.createAdmin();
    jest.spyOn(adminService, 'findById').mockReturnValue(Promise.resolve(fakeAdmin));

    return request(app.getHttpServer())
      .get(`/admins/${fakeAdmin.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.id).toEqual(fakeAdmin.id);
      });
  });

  it('Test create user status code 201', async () => {
    const fakeAdmin = await ModelFactory.createAdmin();
    jest.spyOn(adminService, 'create').mockReturnValue(Promise.resolve(fakeAdmin));
    return request(app.getHttpServer())
      .post('/admins')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        name: fakeAdmin.name,
        email: fakeAdmin.email,
        password: 'StrongPassword123!@#',
        password_confirmation: 'StrongPassword123!@#',
      })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body.data.name).toEqual(fakeAdmin.name);
        expect(res.body.data.email).toEqual(fakeAdmin.email);
      });
  });

  it('Test update user status code 200', async () => {
    const fakeAdmin = await ModelFactory.createAdmin();
    jest.spyOn(adminService, 'findById').mockReturnValue(Promise.resolve(fakeAdmin));

    fakeAdmin.name = 'Test update name';
    jest.spyOn(adminService, 'update').mockReturnValue(Promise.resolve(fakeAdmin));

    return request(app.getHttpServer())
      .put(`/admins/${fakeAdmin.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        name: 'Test update name',
      })
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.name).toEqual('Test update name');
      });
  });

  it('Test delete user status code 200', async () => {
    const fakeAdmin = await ModelFactory.createAdmin();
    jest.spyOn(adminService, 'findById').mockReturnValue(Promise.resolve(fakeAdmin));
    jest.spyOn(adminService, 'delete').mockReturnValue(Promise.resolve(true));

    return request(app.getHttpServer())
      .delete(`/admins/${fakeAdmin.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        title: 'Test update title',
      })
      .expect(200);
  });
});
