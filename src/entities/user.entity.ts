import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Recruit from './recruit.entity';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn({ name: 'user_idx' })
  id: number;

  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ unique: true, name: 'username' })
  username: string;

  @Column({ nullable: false, name: 'password' })
  password: string;

  @OneToMany(() => Recruit, (recruit) => recruit.user)
  recruit: Recruit;
}
