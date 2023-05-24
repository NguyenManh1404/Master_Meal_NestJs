import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

enum DBDialect {
  mysql = 'mysql',
  mariadb = 'mariadb',
}

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: configService.get<DBDialect>('database.driver'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.db_user'),
          password: configService.get<string>('database.db_pass'),
          database: configService.get<string>('database.db_name'),
          models: [__dirname + '/models/**/*.model{.ts,.js}'],
          logging: configService.get<any>('database.logging'),
          synchronize: false,
          sync: {
            force: false,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {
}
