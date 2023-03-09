import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { userProfileProvider } from './provider/user-profile.provider';

@Module({
  providers: [UserProfileService, ...userProfileProvider],
  exports: [UserProfileService, ...userProfileProvider],
})
export class UserProfileModule {}
