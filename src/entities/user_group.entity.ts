import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './post.entity';
import User from './user.entity';
import Group from './group.entity';

@Entity('user_group')
export default class UserGroup extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'user_group_idx' })
  id: number;

  @ManyToOne(() => User, (user) => user.user_group)
  @JoinColumn({ name: 'user_group_user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.user_group)
  @JoinColumn({ name: 'user_group_post_id' })
  post: Post;

  @ManyToOne(() => Group, (group) => group.user_group)
  @JoinColumn({ name: 'user_group_group_id' })
  group: Group;
}
