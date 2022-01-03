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

@Entity('organization')
export default class Organization extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'organizations_idx' })
  organizations_idx: number;

  @ManyToOne(() => User, (user) => user.organization)
  @JoinColumn({ name: 'organization_user' })
  user: User;

  @ManyToOne(() => Post, (post) => post.organization, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_post' })
  post: Post;

  @ManyToOne(() => Group, (group) => group.organization, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_group_id' })
  group: Group;
}
