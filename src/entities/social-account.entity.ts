import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import User from './user.entity';
import { BaseTimeEntity } from './base-time.entity';

@Entity('social_account')
export default class SocialAccount extends BaseTimeEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  accessToken: string;

  @Column()
  provider: string;

  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;
}
