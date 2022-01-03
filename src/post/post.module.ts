import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { OrganizationRepository } from '../organization/organization.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, OrganizationRepository])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
