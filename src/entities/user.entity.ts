import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import Organization from './organization.entity';

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ unique: false, nullable: false, name: 'name' })
  name: string;

  @Column({
    unique: true,
    default: null,
    name: 'current_hashed_refresh_token',
  })
  currentHashedRefreshToken?: string;

  @Column({
    default: false,
    name: 'is_attended',
  })
  isAttended: boolean;

  @OneToOne(() => Organization, (organization) => organization.user, {
    cascade: ['insert', 'update', 'remove'],
  })
  organization: Organization[];
}
