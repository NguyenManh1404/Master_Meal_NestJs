import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { GlobalConfigModule } from './configs/config.module';
import { MailModule } from './mail/mail.module';
import { ApiModule } from './api/api.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppLoggerMiddleware } from './api/middlewares/app-logger.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GlobalConfigModule,
    DatabaseModule,
    MailModule,
    ApiModule,
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
  controllers: [AppController],
})
export class AppModule {
  // public configure(
  //   consumer: MiddlewareConsumer
  // ): void {
  //   consumer.apply(AppLoggerMiddleware)
  //     .forRoutes('*');
  // }
}
