import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../../token/token.service';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor(private readonly tokenService: TokenService) {
    super();
  }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { refresh, authorization } = request.headers;
    if (!authorization)
      throw new BadRequestException('Authorization 헤더가 비어있습니다.');
    else if (!refresh)
      throw new BadRequestException('RefreshToken 헤더가 비어있습니다.');
    const accessToken = authorization.split(' ')[1];
    const refreshToken = refresh.split(' ')[1];
    request.user = this.tokenService.validateToken(
      accessToken,
      refreshToken,
      true,
    );
    return true;
  }
}
