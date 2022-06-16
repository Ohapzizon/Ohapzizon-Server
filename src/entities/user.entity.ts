import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Team from './team.entity';
import Post from './post.entity';
import { Role } from '../user/enum/role';

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

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
    unique: true,
    default: null,
    name: 'current_hashed_refresh_token',
    select: false,
  })
  currentHashedRefreshToken?: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.writer, {
    cascade: ['insert', 'update', 'remove'],
  })
  post: Post[];

  @OneToMany(() => Team, (team) => team.participants, {
    cascade: ['insert', 'update', 'remove'],
  })
  team: Team[];
}
