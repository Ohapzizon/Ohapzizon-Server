import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserService } from '../user/user.service';
import { authTokenProvider } from './provider/auth-token.provider';
import { userProvider } from '../user/provider/user.provider';

@Module({
  controllers: [TokenController],
  providers: [...authTokenProvider, TokenService, ...userProvider, UserService],
})
export class TokenModule {}
