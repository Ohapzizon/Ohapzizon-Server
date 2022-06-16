import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { TeamRepository } from '../team/team.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, TeamRepository]),
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
