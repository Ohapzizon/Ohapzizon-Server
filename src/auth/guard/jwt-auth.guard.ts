import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { validateToken } from '../../token/lib/token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization)
      throw new UnauthorizedException('Authorization 헤더가 비어있습니다.');
    const accessToken: string = authorization.split(' ')[1];
    request.user = validateToken(accessToken); // request.user 객체에 디코딩된 토큰(유저 정보)을 저장합니다.
    return true;
  }
}
