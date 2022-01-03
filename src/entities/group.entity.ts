import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Organization from './organization.entity';

@Entity('group')
export default class Group {
  @PrimaryGeneratedColumn({ name: 'group_idx' })
  group_idx: number;

  @Column({ name: 'idx' })
  idx: number;

  @OneToMany(() => Organization, (organization) => organization.group)
  @JoinColumn({ name: 'organization_group_id' })
  organization: Organization[];
}
