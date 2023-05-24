import { GlobalConfigModule } from '../../configs/config.module';
import { DatabaseModule } from '../../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import UserModel from '../../database/models/user.model';
import LoginHistoryModel from '../../database/models/login-history.model';
import TokenModel from '../../database/models/token.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../../mail/mail.module';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { AccountController } from '../controllers/account.controller';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';
import { ModuleMetadata } from '@nestjs/common';
import { config } from 'dotenv';
import { CommonModule } from '../../common/common.module';
import { JwtStrategy } from '../strageries/jwt.strategy';
import { AdminController } from '../controllers/admin.controller';
import { AuthAdminController } from '../controllers/auth-admin.controller';
import { AdminService } from '../services/admin.service';
import { AuthAdminService } from '../services/auth-admin.service';
import AdminModel from '../../database/models/admin.model';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { async } from 'rxjs';
import { Request } from 'express';
import { FileFilterCallback, Multer } from 'multer';
import { FollowerController } from '../controllers/follower.controller';
import { FollowerService } from '../services/follower.service';
import FollowerModel from '../../database/models/follower.model';
config();

export const moduleMetadataHelper: ModuleMetadata = {
  imports: [
    GlobalConfigModule,
    DatabaseModule,
    SequelizeModule.forFeature([
      UserModel,
      AdminModel,
      LoginHistoryModel,
      TokenModel,
      FollowerModel,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('uploadFolder'),
        fileFilter: async (
          request: Request,
          file: Express.Multer.File,
          cb: FileFilterCallback
        ) => {
          if (
            !configService.get<string[]>('allowMimes').includes(file.mimetype)
          ) {
            cb(new Error('Your file type is not allowed'));
          }
          cb(null, true);
        },
      }),
    }),
    CommonModule,
    MailModule,
  ],
  controllers: [
    AuthController,
    AccountController,
    UserController,
    AdminController,
    AuthAdminController,
    FollowerController,
  ],
  providers: [
    JwtStrategy,
    AuthService,
    AccountService,
    UserService,
    AdminService,
    AuthAdminService,
    FollowerService,
  ],
};
