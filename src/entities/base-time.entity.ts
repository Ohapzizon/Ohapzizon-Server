import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseTimeEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
