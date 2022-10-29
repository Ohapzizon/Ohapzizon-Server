import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import User from './user.entity';

@Entity('auth_token')
export default class AuthToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;
}
