import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Team from './team.entity';
import Post from './post.entity';
import { Role } from '../user/enum/role';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'google_id', unique: true, nullable: false })
  googleId: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'name', unique: false, nullable: false })
  name: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    name: 'current_hashed_refresh_token',
    nullable: true,
    default: null,
    select: false,
  })
  currentHashedRefreshToken?: string;

  @OneToMany(() => Post, (post) => post.writer, {
    cascade: ['insert', 'update', 'remove'],
  })
  post: Post[];

  @OneToMany(() => Team, (team) => team.participants, {
    cascade: ['insert', 'update', 'remove'],
  })
  team: Team[];
}
