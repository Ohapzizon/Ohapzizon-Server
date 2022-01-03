import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Organization from './organization.entity';
import Board from './board.entity';
import { DayOrNight } from '../common/types/day-or-night.enum';

@Entity('post')
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'post_idx' })
  post_idx: number;

  @Column({ name: 'post_title' })
  title: string;

  @Column({ name: 'post_contents' })
  contents: string;

  @Column({
    name: 'is_day_and_night',
    type: 'enum',
    enum: ['DAY', 'NIGHT', 'NONE'],
    default: 'NONE',
  })
  isDayOrNight: DayOrNight;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'max_count' })
  maxCount: number;

  @OneToMany(() => Organization, (organization) => organization.post)
  @JoinColumn({ name: 'post_organization' })
  organization: Organization[];

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'post_user' })
  user: User;

  @OneToMany(() => Board, (board) => board.post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_board' })
  board: Board[];
}
