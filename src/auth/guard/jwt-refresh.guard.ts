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
    const { refresh } = request.headers;

    if (refresh === undefined) {
      throw new BadRequestException('RefreshToken 헤더가 비어있습니다.');
    }

    const refreshToken = refresh.replace('Bearer ', '');
    request.user = this.tokenService.validateToken(refreshToken, true);
    return true;
  }
}
