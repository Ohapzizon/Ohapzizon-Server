import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../post/post.repository';
import { UserRepository } from '../user/user.repository';
import { OrganizationRepository } from './organization.repository';
import { GroupService } from '../group/group.service';
import User from '../entities/user.entity';
import Post from '../entities/post.entity';
import Group from '../entities/group.entity';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly groupService: GroupService,
  ) {}

  async participate(idx: string) {
    const user: User = await this.userRepository.findUser({
      where: idx,
    });
    const post: Post = await this.postRepository.findPost({
      where: idx,
    });
    const group: Group = await this.groupService.saveGroup(idx);
    return this.organizationRepository.save({
      user: user,
      post: post,
      group: group,
    });
  }
}
