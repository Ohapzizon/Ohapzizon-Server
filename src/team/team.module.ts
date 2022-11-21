import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { teamProvider } from './provider/team.provider';
import { postProvider } from '../post/provider/post.provider';
import { PostService } from '../post/post.service';

@Module({
  controllers: [TeamController],
  providers: [...teamProvider, TeamService, ...postProvider, PostService],
})
export class TeamModule {}
