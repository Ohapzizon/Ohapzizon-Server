import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import Post from '../../entities/post.entity';
import Team from '../../entities/team.entity';
import { PostStatus } from '../../post/enum/post-status';

@EventSubscriber()
export class TeamSubscriber implements EntitySubscriberInterface<Team> {
  constructor(private readonly event: InsertEvent<Team>) {}

  listenTo(): ReturnType<EntitySubscriberInterface['listenTo']> {
    return Team;
  }

  async afterInsert(): Promise<void> {
    const { entity, manager } = this.event;
    console.log(entity.post);
    const post: Post = await manager.findOneByOrFail(Post, {
      id: entity.postId,
    });
    const count = await manager.count(Team);
    if (post.limit <= count) {
      post.status = PostStatus.CLOSED;
      await manager.save(post);
    }
  }
}
