import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import UserModel from '../../database/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import TokenModel from '../../database/models/token.model';
import { TokenTypes } from '../../common/constants/token.const';
import * as bcrypt from 'bcrypt';
import AdminModel from '../../database/models/admin.model';
import { PathAPI } from '../../common/path-api';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(TokenModel)
    private tokenModel: typeof TokenModel
  ) {}

  public async sendUserConfirmation(user: UserModel): Promise<boolean> {
    const confirmationToken = await this.tokenModel.create({
      model_type: 'UserModel',
      model_id: user.id,
      token_type: TokenTypes.EMAIL_CONFIRMATION,
      token_value: await bcrypt.hash(
        user.name + user.email + user.name,
        10
      ),
    });

    const url = `example.com/auth/confirm?token=${confirmationToken.token_value}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Comtan Group" <no-reply@comtan.com>', // override default from
      subject:
        '[No Reply] Welcome to Comtan membership! Please confirm your Email.',
      template: './email-confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });

    return true;
  }

  public async sendRequestNewPassword(user: UserModel): Promise<boolean> {
    const resetPasswordToken = await this.tokenModel.create({
      model_type: 'UserModel',
      model_id: user.id,
      token_type: TokenTypes.RESET_PASSWORD,
      token_value: await bcrypt.hash(
        user.name + user.email + user.name,
        10
      ),
    });

    const url = `example.com/auth/reset-password?token=${resetPasswordToken.token_value}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Comtan Group" <no-reply@comtan.com>', // override default from
      subject: '[No Reply] Request to reset password.',
      template: './email-confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });

    return true;
  }

  public async sendAdminConfirmation(admin: AdminModel): Promise<void> {
    const confirmationToken = await this.tokenModel.create({
      model_type: 'AdminModel',
      model_id: admin.id,
      token_type: TokenTypes.EMAIL_CONFIRMATION,
      token_value: await bcrypt.hash(admin.name + admin.email, 10),
    });

    const url = `example.com/auth-admin/confirm?token=${confirmationToken.token_value}`;
    await this.mailerService.sendMail({
      to: admin.email,
      from: '"Comtan Group" <no-reply@comtan.com>', // override default from
      subject:
        '[No Reply] Welcome to Comtan membership! Please confirm your Email.',
      template: './email-confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: admin.name,
        url,
      },
    });
  }

  public async sendRequestAdminNewPassword(admin: AdminModel): Promise<void> {
    const resetPasswordToken = await this.tokenModel.create({
      model_type: 'AdminModel',
      model_id: admin.id,
      token_type: TokenTypes.RESET_PASSWORD,
      token_value: await bcrypt.hash(admin.name + admin.email, 10),
    });
    const url =
      PathAPI.PATH_SEND_MAIL_FORGETPASS +
      `?token=${resetPasswordToken.token_value}`;
    await this.mailerService.sendMail({
      to: admin.email,
      from: '"Comtan Group" <no-reply@comtan.com>', // override default from
      subject: '[No Reply] Request to reset password.',
      template: './email-confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: admin.name,
        url,
      },
    });
  }
}
