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

@Entity('organizations')
export default class Organization extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'organizations_idx' })
  organizations_idx: number;

  @ManyToOne(() => User, (user) => user.organization)
  @JoinColumn({ name: 'organizations_user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.organization)
  @JoinColumn({ name: 'organizations_post_id' })
  post: Post;

  @ManyToOne(() => Group, (group) => group.organization)
  @JoinColumn({ name: 'organizations_group_id' })
  group: Group;
}
