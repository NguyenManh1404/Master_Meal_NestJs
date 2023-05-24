import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {RoleTypes} from '../../common/constants/role.const';
import {ROLES_KEY} from '../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {

  }

  public canActivate(
    context: ExecutionContext
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleTypes[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const {user} = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.types?.includes(role));
  }
}
