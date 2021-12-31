import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import Post from './post.entity';
import UserGroup from './user_group.entity';

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'user_idx' })
  idx: string;

  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ unique: true, nullable: false, name: 'name' })
  name: string;

  @OneToMany(() => UserGroup, (user_group) => user_group.user)
  @JoinColumn({ name: 'user_user_group_id' })
  user_group: UserGroup[];

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'user_post_id' })
  post: Post[];
}
