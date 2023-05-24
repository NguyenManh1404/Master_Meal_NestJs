import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from '../../services/user.service';
import {GlobalConfigModule} from '../../../configs/config.module';
import {DatabaseModule} from '../../../database/database.module';
import {SequelizeModule} from '@nestjs/sequelize';
import UserModel from '../../../database/models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalConfigModule,
        DatabaseModule,
        SequelizeModule.forFeature([
          UserModel,
        ]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
