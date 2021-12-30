import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Recruit from './recruit.entity';

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
  recruit: Recruit;
}
