import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import Post from './post.entity';
import Organization from './organization.entity';

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'user_idx' })
  user_idx: string;

  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ unique: true, nullable: false, name: 'name' })
  name: string;

  @OneToMany(() => Organization, (organization) => organization.user)
  @JoinColumn({ name: 'user_organization_id' })
  organization: Organization[];

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'user_post_id' })
  post: Post[];
}
