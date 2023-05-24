import {Test, TestingModule} from '@nestjs/testing';
import {MailService} from './mail.service';
import {GlobalConfigModule} from '../../configs/config.module';
import {DatabaseModule} from '../../database/database.module';
import {SequelizeModule} from '@nestjs/sequelize';
import UserModel from '../../database/models/user.model';
import TokenModel from '../../database/models/token.model';
import {MailerModule, MailerOptions} from '@nestjs-modules/mailer';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {ApiModule} from '../../api/api.module';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalConfigModule,
        DatabaseModule,
        ApiModule,
        SequelizeModule.forFeature([
          UserModel,
          TokenModel,
        ]),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configs: ConfigService): MailerOptions => ({
            transport: {
              host: configs.get<string>('mail.host'),
              port: configs.get<number>('mail.port'),
              secure: configs.get<boolean>('mail.secure'),
              auth: {
                user: configs.get<string>('mail.username'),
                pass: configs.get<string>('mail.password'),
              },
            },
            defaults: {
              from: `No Reply " ${configs.get<string>('mail.alias')}`,
            },
            template: {
              dir: __dirname + '/templates',
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
        }),
      ],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
