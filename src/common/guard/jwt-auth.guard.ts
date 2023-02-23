import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { validateToken } from '../utils/token.util';
import { AccessTokenData } from '../../token/types/token-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (!authorization)
      throw new UnauthorizedException('Authorization 헤더가 비어있습니다.');
    let accessToken = authorization.split(' ')[1];
    const ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    accessToken = await validateToken<AccessTokenData>(
      accessToken,
      ACCESS_TOKEN_SECRET,
    );
    req.access_token = accessToken;
    return true;
  }
}
