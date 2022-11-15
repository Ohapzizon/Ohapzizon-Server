import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { GoogleAuthModule } from './google/google-auth.module';

@Module({
  imports: [forwardRef(() => GoogleAuthModule)],
  controllers: [AuthController],
  providers: [AuthService, TokenService, UserService],
  exports: [AuthService, TokenService, UserService, GoogleAuthModule],
})
export class AuthModule {}
