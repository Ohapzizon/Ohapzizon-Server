import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleAuthController } from './social/google/google-auth.controller';
import { GoogleAuthService } from './social/google/google-auth.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, GoogleAuthService],
})
export class AuthModule {}
