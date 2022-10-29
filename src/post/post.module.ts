import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostService, UserService],
  exports: [PostService, UserService],
})
export class PostModule {}
