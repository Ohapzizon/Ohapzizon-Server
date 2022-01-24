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

  async participate(idx: number) {
    let user: User = null;
    let post: Post = null;
    let group: Group = null;
    try {
      user = await this.userRepository.findUser({
        where: { user_idx: idx },
      });
      post = await this.postRepository.findPost({
        where: { post_idx: idx },
      });
      group = await this.groupService.saveGroup();
    } catch (e) {
      throw new NotFoundException('해당하는 게시글을 찾을 수 없습니다.');
    }
    await this.organizationRepository.findUser(user.user_idx);
    await this.organizationRepository.save({
      user: user,
      post: post,
      group: group,
    });
  }
}
