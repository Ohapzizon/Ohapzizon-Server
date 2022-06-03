import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './post.entity';
import User from './user.entity';
import { Status } from '../team/enum/status';

@Entity('team')
export default class Team {
  @PrimaryGeneratedColumn({ name: 'team_idx' })
  idx: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.WAIT,
  })
  status: Status;

  @OneToOne(() => User, (user) => user.team, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'post_idx' })
  post: Post;
}
