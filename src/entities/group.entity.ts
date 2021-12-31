import { Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import UserGroup from './user_group.entity';

@Entity('group')
export default class Group {
  @PrimaryGeneratedColumn({ name: 'group_idx' })
  idx: number;

  @OneToMany(() => UserGroup, (user_group) => user_group.group)
  @JoinColumn({ name: 'group_user_group_id' })
  user_group: UserGroup;
}
