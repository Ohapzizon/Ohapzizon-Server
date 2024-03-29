import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './post.entity';
import User from './user.entity';
import { JoinStatus } from '../team/enum/join-status';
import { BaseTimeEntity } from './base-time.entity';

@Entity('team')
export default class Team extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: '' })
  bio: string;

  @Column({
    type: 'enum',
    enum: JoinStatus,
    default: JoinStatus.WAIT,
  })
  status: JoinStatus;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'post_id', nullable: false })
  postId: number;

  @ManyToOne(() => Post, (post) => post.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
