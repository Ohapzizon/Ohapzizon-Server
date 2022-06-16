import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { matchRoles } from '../lib/match-role';
import User from '../../entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return matchRoles(roles, user.role);
  }
}
