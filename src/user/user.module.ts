import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [UserProfileModule],
  controllers: [UserController],
  exports: [UserProfileModule],
})
export class UserModule {}
