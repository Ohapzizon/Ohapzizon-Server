import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { TokenService } from '../../../token/token.service';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, TokenService],
})
export class GoogleAuthModule {}
