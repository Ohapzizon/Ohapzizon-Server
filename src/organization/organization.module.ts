import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';
import { UserRepository } from '../user/user.repository';
import { PostRepository } from '../post/post.repository';
import { GroupService } from '../group/group.service';
import { OrganizationController } from './organization.controller';
import { GroupRepository } from '../group/group.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationRepository,
      PostRepository,
      UserRepository,
      GroupRepository,
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, GroupService],

})
export class OrganizationModule {}
