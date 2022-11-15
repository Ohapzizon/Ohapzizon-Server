import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import User from './user.entity';
import { Grade } from '../user/user-profile/enum/grade';
import { Department } from '../user/user-profile/enum/department';
import { BaseTimeEntity } from './base-time.entity';

@Entity('user_profile')
export default class UserProfile extends BaseTimeEntity {
  @PrimaryColumn()
  userId: number;

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

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  user: User;
}
