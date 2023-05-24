import {Module} from '@nestjs/common';
import {MailService} from './services/mail.service';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {MailerModule} from '@nestjs-modules/mailer';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {SequelizeModule} from '@nestjs/sequelize';
import UserModel from '../database/models/user.model';
import TokenModel from '../database/models/token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      TokenModel,
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configs: ConfigService) => ({
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
  exports: [MailService], // 👈 export for DI
})
export class MailModule {
}
