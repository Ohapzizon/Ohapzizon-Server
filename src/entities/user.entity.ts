import { Column, Entity, PrimaryColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export default class User {
  @PrimaryColumn()
  user_idx: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    name: 'current_hashed_refresh_token',
    nullable: true,
    default: null,
  })
  currentHashedRefreshToken?: string;

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
