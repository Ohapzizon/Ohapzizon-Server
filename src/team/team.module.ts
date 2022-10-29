import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
