import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AccessTokenData,
  RefreshTokenData,
  RegisterTokenData,
} from '../../token/types/tokenData';

export const AccessToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token: AccessTokenData = request.access_token;
    return data ? token?.[data] : token;
  },
);

export const RefreshToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token: RefreshTokenData = request.refresh_token;
    return data ? token?.[data] : token;
  },
);

export const RegisterToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token: RegisterTokenData = request.register_token;
    return data ? token?.[data] : token;
  },
);
