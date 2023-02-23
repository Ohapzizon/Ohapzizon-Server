import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { CookieUtil } from '../common/utils/cookie.util';
import { authTokenProvider } from './provider/auth-token.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TokenController],
  providers: [TokenService, CookieUtil, ...authTokenProvider],
  exports: [TokenService, CookieUtil, ...authTokenProvider],
})
export class TokenModule {}
