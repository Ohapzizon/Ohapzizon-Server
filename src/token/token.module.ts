import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [TokenController],
  providers: [TokenService, UserService],
})
export class TokenModule {}
