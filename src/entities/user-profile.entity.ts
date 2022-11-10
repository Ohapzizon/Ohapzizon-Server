import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import { Grade } from '../user/user-profile/enum/grade';
import { Department } from '../user/user-profile/enum/department';

@Entity('user_profile')
export default class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  displayName: string;

  @Column({ nullable: true })
  thumbnail?: string | null;

  @Column({ nullable: true })
  discordTag?: string | null;

  @Column({ type: 'enum', enum: Grade, default: Grade.NONE })
  grade: Grade;

  @Column({ type: 'enum', enum: Department, default: Department.NONE })
  department: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;
}
