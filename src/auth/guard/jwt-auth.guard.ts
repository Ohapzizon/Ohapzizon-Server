import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../../token/token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new BadRequestException('Authorization 헤더가 비어있습니다.');
    }
    const accessToken = authorization.split(' ')[1];
    request.user = this.tokenService.validateToken(accessToken); // request.user 객체에 디코딩된 토큰(유저 정보)을 저장합니다.
    return true;
  }
}
