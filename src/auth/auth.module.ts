import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { GoogleAuthModule } from './google/google-auth.module';
import { socialAccountProvider } from './provider/social-account.provider';
import { authTokenProvider } from '../token/provider/auth-token.provider';
import { userProvider } from '../user/provider/user.provider';

@Module({
  imports: [forwardRef(() => GoogleAuthModule)],
  controllers: [AuthController],
  providers: [
    ...socialAccountProvider,
    ...authTokenProvider,
    ...userProvider,
    AuthService,
    TokenService,
    UserService,
  ],
  exports: [
    ...socialAccountProvider,
    ...authTokenProvider,
    ...userProvider,
    AuthService,
    TokenService,
    UserService,
    GoogleAuthModule,
  ],
})
export class AuthModule {}
