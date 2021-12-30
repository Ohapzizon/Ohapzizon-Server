import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
