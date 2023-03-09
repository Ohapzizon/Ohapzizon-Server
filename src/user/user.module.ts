import { Module } from '@nestjs/common';
import { UserProfileModule } from './user-profile/user-profile.module';
import { userProvider } from './provider/user.provider';

@Module({
  imports: [UserProfileModule],
  providers: [...userProvider],
  exports: [UserProfileModule],
})
export class UserModule {}
