import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { teamProvider } from './provider/team.provider';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [TeamController],
  providers: [TeamService, ...teamProvider],
})
export class TeamModule {}
