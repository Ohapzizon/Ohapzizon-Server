import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { validateToken } from '../../token/lib/token';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { refresh, authorization } = request.headers;
    if (!authorization)
      throw new BadRequestException('Authorization 헤더가 비어있습니다.');
    else if (!refresh)
      throw new BadRequestException('RefreshToken 헤더가 비어있습니다.');
    const accessToken = authorization.split(' ')[1];
    const refreshToken = refresh.split(' ')[1];
    request.user = validateToken(accessToken, refreshToken, true);
    return true;
  }
}
