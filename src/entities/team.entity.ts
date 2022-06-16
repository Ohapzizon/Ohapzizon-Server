import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.team, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  participants: User;

  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    lazy: true,
  })
  @JoinColumn({ name: 'post_idx' })
  post: Promise<Post>;
}
