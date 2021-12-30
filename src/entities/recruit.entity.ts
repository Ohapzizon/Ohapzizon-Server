import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './post.entity';
import User from './user.entity';

@Entity('recruit')
export default class Recruit extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'recruit_idx' })
  id: number;

  @ManyToOne(() => User, (user) => user.recruit)
  @JoinColumn({ name: 'recruit_user' })
  user: User;

  @OneToOne(() => Post, (post) => post.recruit)
  @JoinColumn({ name: 'recruit_post' })
  post: Post;
}
