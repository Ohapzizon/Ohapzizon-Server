import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleAuthModule } from './google/google-auth.module';
import { socialAccountProvider } from './provider/social-account.provider';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => GoogleAuthModule), TokenModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, ...socialAccountProvider],
  exports: [AuthService, GoogleAuthModule],
})
export class AuthModule {}
