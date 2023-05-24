import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {AdminService} from '../services/admin.service';
import {RoleTypes} from '../../common/constants/role.const';

export interface JWTRequest {
  user: ICurrentLoggedUser;
}

export interface ICurrentLoggedUser {
  types: string[];
  attributes: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected userService: UserService,
    protected adminService: AdminService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(
    payload: any
  ): Promise<ICurrentLoggedUser> {
    switch (payload.type) {
      case RoleTypes.USER:
        const user = await this.userService.findCurrentUser(payload.id);
        if (!user) {
          throw new UnauthorizedException();
        }

        return {
          types: [RoleTypes.USER],
          attributes: user.dataValues,
        };
      case RoleTypes.ADMIN:
        const admin = await this.adminService.findCurrentAdmin(payload.id);
        if (!admin) {
          throw new UnauthorizedException();
        }

        return {
          types: [RoleTypes.ADMIN],
          attributes: admin.dataValues,
        };
      default:
        throw new UnauthorizedException();
    }
  }
}
