import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PostService } from '../post/post.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, PostService],
})
export class TeamModule {}
