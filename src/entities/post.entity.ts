import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Recruit from './recruit.entity';
import User from './user.entity';

@Entity('post')
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'post_idx' })
  idx: number;

  @Column({ name: 'post_title' })
  title: string;

  @Column({ name: 'head_count' })
  headCount: number;

  @Column({ name: 'post_contents' })
  contents: string;

  @Column({ name: 'is_day_and_night' })
  isDayAndNight: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Recruit, (recruit) => recruit.post)
  @JoinColumn({ name: 'post_recruit' })
  recruit: Recruit;

  @ManyToOne(() => User, (user) => user.post)
  user: User;
}
