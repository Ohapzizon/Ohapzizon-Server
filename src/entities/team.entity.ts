import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Post from './post.entity';
import User from './user.entity';
import { JoinStatus } from '../team/enum/join-status';

@Entity('team')
export default class Team {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'fk_post_id' })
  post: Post;
}
