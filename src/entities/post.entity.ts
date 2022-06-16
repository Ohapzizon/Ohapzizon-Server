import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Team from './team.entity';
import User from './user.entity';
import { MealTime } from '../post/enum/meal-time';

@Entity('post')
export default class Post {
  @PrimaryGeneratedColumn({ name: 'post_idx' })
  idx: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'contents' })
  contents: string;

  @Column({ name: 'max_count' })
  maxCount: number;

  @Column({
    name: 'meal_time',
    type: 'enum',
    enum: MealTime,
  })
  mealTime: MealTime;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.post, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  writer: User;

  @OneToMany(() => Team, (team) => team.post, {
    cascade: ['insert', 'update', 'remove'],
  })
  team: Team[];

  @BeforeInsert()
  private timeCheck(): void {
    const currentDate: Date = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    if (0 <= currentHour && currentHour <= 13 && currentMinute <= 30)
      this.mealTime = MealTime.LUNCH;
    else this.mealTime = MealTime.DINNER;
  }
}
