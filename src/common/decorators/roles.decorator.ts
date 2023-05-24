import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '../constants/role.const';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleTypes[]) => SetMetadata(ROLES_KEY, roles);
