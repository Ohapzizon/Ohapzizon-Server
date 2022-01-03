import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import Post from './post.entity';
import Organization from './organization.entity';
import * as bcrypt from 'bcrypt';

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'user_idx' })
  user_idx: string;

  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ unique: true, nullable: false, name: 'name' })
  name: string;

  @Column({
    nullable: true,
    default: null,
    name: 'current_hashed_refresh_token',
    select: false,
  })
  currentHashedRefreshToken?: string;

  @OneToMany(() => Organization, (organization) => organization.user)
  @JoinColumn({ name: 'user_organization' })
  organization: Organization[];

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'user_post' })
  post: Post[];

  async checkRefreshToken(plainRefreshToken: string): Promise<boolean> {
    return await bcrypt.compare(
      plainRefreshToken,
      this.currentHashedRefreshToken,
    );
  }

  async removeRefreshToken() {
    return (this.currentHashedRefreshToken = null);
  }
}
