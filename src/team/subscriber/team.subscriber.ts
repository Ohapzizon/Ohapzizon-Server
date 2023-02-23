import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import Post from '../../entities/post.entity';
import Team from '../../entities/team.entity';
import { PostStatus } from '../../post/enum/post-status';

@EventSubscriber()
export class TeamSubscriber implements EntitySubscriberInterface<Team> {
  listenTo(): ReturnType<EntitySubscriberInterface['listenTo']> {
    return Team;
  }

  async afterInsert(event: InsertEvent<Team>): Promise<void> {
    const { entity, manager } = event;
    const post: Post = await manager.findOneOrFail(Post, {
      where: {
        id: entity.postId,
      },
    });
    const count = await manager.count(Team);
    if (post.limit <= count) post.status = PostStatus.CLOSED;
  }
}
