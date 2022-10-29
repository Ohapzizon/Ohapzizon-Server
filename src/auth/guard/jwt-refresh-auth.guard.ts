import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { validateToken } from '../../token/lib/token';
import { RefreshTokenData } from '../../token/types/token-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { refresh_token } = req.headers;
    if (!refresh_token)
      throw new UnauthorizedException('Refresh Token 헤더가 비어있습니다.');
    let refreshToken = refresh_token.split(' ')[1];
    const REFRESH_TOKEN_SECRET = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    refreshToken = await validateToken<RefreshTokenData>(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      true,
    );
    req.refresh_token = refreshToken;
    return true;
  }
}
