import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from '../../entities/user.entity';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    return data ? user?.[data] : user;
  },
);
