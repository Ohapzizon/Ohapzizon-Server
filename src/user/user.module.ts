import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PostService } from '../post/post.service';
import { UserProfileService } from './user-profile/user-profile.service';

@Module({
  controllers: [UserController],
  providers: [PostService, UserProfileService],
})
export class UserModule {}
