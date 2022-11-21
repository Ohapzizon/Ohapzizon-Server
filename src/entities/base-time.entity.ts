import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LocalDateTimeTransformer } from '../common/transformer/local-date-time.transformer';
import { LocalDateTime } from '@js-joda/core';

export class BaseTimeEntity {
  @CreateDateColumn({
    type: 'datetime',
    transformer: new LocalDateTimeTransformer(),
  })
  createdAt: LocalDateTime;

  @UpdateDateColumn({
    type: 'datetime',
    transformer: new LocalDateTimeTransformer(),
  })
  updatedAt: LocalDateTime;
}
