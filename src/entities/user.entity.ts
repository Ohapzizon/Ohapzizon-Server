import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Recruit from './recruit.entity';
import { JoinColumn } from 'typeorm/browser';
import Post from './post.entity';

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'username' })
  username: string;

  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ nullable: false, name: 'password' })
  password: string;

  @OneToMany(() => Recruit, (recruit) => recruit.user)
  @JoinColumn({ name: 'user_recruit' })
  recruit: Recruit;

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'user_post' })
  post: Post[];
}
