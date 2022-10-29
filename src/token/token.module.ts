import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserModule],
  controllers: [TokenController],
  providers: [TokenService, UserService],
  exports: [TokenService, UserService],
})
export class TokenModule {}
