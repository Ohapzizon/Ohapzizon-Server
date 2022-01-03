import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../post/post.repository';
import { UserRepository } from '../user/user.repository';
import { OrganizationRepository } from './organization.repository';
import { GroupService } from '../group/group.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly groupService: GroupService,
  ) {}

  async participate(idx: number) {
    // getheader user info
    const user_info = 1;
    const user = await this.userRepository.findOne(user_info)
    const post = await this.postRepository.findOne(idx);
    const group = await this.groupService.saveGroup(idx);
    try {

      if(post == undefined )
        throw new NotFoundException('존재하지 않는 게시글입니다')
    }
    catch (e){
      e.message();
    }
    return this.organizationRepository.save({
      user: user,
      post: post,
      group: group,
    });

  }
}