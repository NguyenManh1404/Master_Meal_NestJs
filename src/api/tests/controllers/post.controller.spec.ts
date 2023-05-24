import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {Response} from 'supertest';
import {PostService} from '../../services/post.service';
import ModelFactory from '../../../database/factories/model.factory';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';
import {initApplicationForTesting} from '../libs/application.helper';
import {UserService} from '../../services/user.service';
import PostModel from '../../../database/models/post.model';
import {JwtService} from '@nestjs/jwt';
import TokenModel from '../../../database/models/token.model';
import UserModel from '../../../database/models/user.model';

describe('PostControllerTest', () => {
  let bearerToken: TokenModel;
  let app: INestApplication;
  let postService: PostService;
  let userService: UserService;
  let jwtService: JwtService;
  let fakeUser: UserModel;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    app = await initApplicationForTesting(module);

    userService = module.get<UserService>(UserService);
    postService = await module.get<PostService>(PostService);
    jwtService = await module.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    fakeUser = await ModelFactory.createUser();
    bearerToken = await ModelFactory.createBearerToken(jwtService, fakeUser);
    jest.spyOn(userService, 'findCurrentUser').mockReturnValue(Promise.resolve(fakeUser));
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Test get list posts with pagination', async () => {
    const fakePosts: PostModel[] = [];
    for (let i = 0; i < 5; i++) {
      fakePosts.push(await ModelFactory.createPost());
    }
    jest.spyOn(postService, 'getByQueryParams').mockReturnValue(Promise.resolve({
      rows: fakePosts,
      count: 100,
    }));

    return request(app.getHttpServer())
      .get('/posts?limit=5')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.length).toEqual(5);
      });
  });

  it('Test get post detail status code 200', async () => {
    const fakePost = await ModelFactory.createPost();
    jest.spyOn(postService, 'findById').mockReturnValue(Promise.resolve(fakePost));

    return request(app.getHttpServer())
      .get(`/posts/${fakePost.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.id).toEqual(fakePost.id);
        expect(res.body.data.title).toEqual(fakePost.title);
      });
  });

  it('Test create post status code 201', async () => {
    const fakePost = await ModelFactory.createPost();
    jest.spyOn(postService, 'create').mockReturnValue(Promise.resolve(fakePost));
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        title: fakePost.title,
        excerpt: fakePost.excerpt,
        content: fakePost.content,
      })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body.data.title).toEqual(fakePost.title);
        expect(res.body.data.excerpt).toEqual(fakePost.excerpt);
        expect(res.body.data.content).toEqual(fakePost.content);
      });
  });

  it('Test update post status code 200', async () => {
    const fakePost = await ModelFactory.createPost();
    jest.spyOn(postService, 'findById').mockReturnValue(Promise.resolve(fakePost));

    fakePost.title = 'Test update title';
    jest.spyOn(postService, 'update').mockReturnValue(Promise.resolve(fakePost));

    return request(app.getHttpServer())
      .put(`/posts/${fakePost.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        title: 'Test update title',
      })
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.data.title).toEqual('Test update title');
      });
  });

  it('Test delete post status code 200', async () => {
    const fakePost = await ModelFactory.createPost();
    jest.spyOn(postService, 'findById').mockReturnValue(Promise.resolve(fakePost));
    jest.spyOn(postService, 'delete').mockReturnValue(Promise.resolve(true));

    return request(app.getHttpServer())
      .delete(`/posts/${fakePost.id}`)
      .set('Authorization', `Bearer ${bearerToken.token_value}`)
      .send({
        title: 'Test update title',
      })
      .expect(200);
  });
});
