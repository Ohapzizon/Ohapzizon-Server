import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SocialRegisterTokenData } from '../../token/types/token-data';
import { validateToken } from '../../token/lib/token';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocialRegisterAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { register_token } = req.headers;
    if (!register_token)
      throw new UnauthorizedException('Register Token 헤더가 비어있습니다.');
    let registerToken = register_token.split(' ')[1];
    const REGISTER_TOKEN_SECRET = this.configService.get<string>(
      'REGISTER_TOKEN_SECRET',
    );
    registerToken = await validateToken<SocialRegisterTokenData>(
      registerToken,
      REGISTER_TOKEN_SECRET,
    );
    req.register_token = registerToken;
    return true;
  }
}
