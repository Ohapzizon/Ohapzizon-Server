import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { postProvider } from './provider/post.provider';

@Module({
  controllers: [PostController],
  providers: [PostService, ...postProvider],
  exports: [PostService, ...postProvider],
})
export class PostModule {}
