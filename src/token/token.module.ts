import { Logger, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [TokenService, Logger],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
