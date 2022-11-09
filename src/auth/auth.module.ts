import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { GoogleAuthModule } from './social/google/google-auth.module';
import { TokenService } from '../token/token.service';

@Module({
  imports: [GoogleAuthModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, UserService],
})
export class AuthModule {}
