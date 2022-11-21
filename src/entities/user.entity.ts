import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../user/enum/role';
import UserProfile from './user-profile.entity';
import { BaseTimeEntity } from './base-time.entity';

@Entity('user')
export default class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToOne(() => UserProfile, { eager: true })
  @JoinColumn({ name: 'profile_id' })
  profile: UserProfile;
}
