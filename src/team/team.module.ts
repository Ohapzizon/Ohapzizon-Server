import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamRepository]),
    PostModule,
    UserModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
