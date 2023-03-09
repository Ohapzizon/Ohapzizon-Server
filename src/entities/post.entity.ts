import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import { TargetGrade } from '../post/enum/target-grade';
import { LocalDateTime } from '@js-joda/core';
import { LocalDateTimeTransformer } from '../common/transformer/local-date-time.transformer';
import { PostStatus } from '../post/enum/post-status';
import { BaseTimeEntity } from './base-time.entity';
import Team from './team.entity';

@Entity('post')
export default class Post extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  contents: string;

  @Column()
  limit: number;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.OPEN,
  })
  status: PostStatus;

  @Column({
    type: 'enum',
    enum: TargetGrade,
  })
  targetGrade: TargetGrade;

  @Column({
    type: 'datetime',
    transformer: new LocalDateTimeTransformer(),
  })
  reserveDateTime: LocalDateTime;

  @Column({ name: 'user_id' })
  writerId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  writer: User;

  @OneToMany(() => Team, (team) => team.id)
  @JoinColumn({ name: 'team_id' })
  team: Team[];
}
