import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../user/enum/role';
import UserProfile from './user-profile.entity';
import { BaseTimeEntity } from './base-time.entity';
import Post from './post.entity';

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

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    eager: true,
  })
  profile: UserProfile;
  post: Post[];
}
