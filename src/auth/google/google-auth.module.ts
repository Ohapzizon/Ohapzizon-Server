import { forwardRef, Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { AuthModule } from '../auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [forwardRef(() => AuthModule), HttpModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
