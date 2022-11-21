import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { postProvider } from './provider/post.provider';
import { teamProvider } from '../team/provider/team.provider';
import { TeamService } from '../team/team.service';

@Module({
  controllers: [PostController],
  providers: [...postProvider, PostService, ...teamProvider, TeamService],
})
export class PostModule {}
