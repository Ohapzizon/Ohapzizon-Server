import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../user/enum/role';
import { AccessTokenData } from '../../token/types/tokenData';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const accessToken: AccessTokenData = request.access_token;
    return matchRoles(roles, accessToken.role);
  }
}

export const matchRoles = (roles: string[], userRoles: Role): true => {
  if (roles.some((role) => role === userRoles))
    throw new ForbiddenException(
      '요청에 대한 액세스 권한이 없어 접근을 거부합니다.',
    );
  return true;
};
