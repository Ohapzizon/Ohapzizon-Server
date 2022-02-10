import { Injectable } from '@nestjs/common';
import { PostRepository } from '../post/post.repository';
import { UserRepository } from '../user/user.repository';
import { OrganizationRepository } from './organization.repository';
import User from '../entities/user.entity';
import { GroupRepository } from '../group/group.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async participate(idx: number, user: User) {
    const post = await this.postRepository.findPost({
      where: { post_idx: idx },
    });
    await this.organizationRepository.userExistsCheck(
      user.user_idx,
      post.post_idx,
    );
    const group = await this.groupRepository.findOne(idx);
    await this.organizationRepository.save({
      user,
      post,
      group,
    });
  }
}
