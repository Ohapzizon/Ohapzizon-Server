import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from '../common/utils/date-time.util';

export abstract class BaseTimeEntity {
  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;

  getCreatedAt(): LocalDateTime {
    return DateTimeUtil.toLocalDateTime(this.createdAt);
  }

  getUpdatedAt(): LocalDateTime {
    return DateTimeUtil.toLocalDateTime(this.updatedAt);
  }
}
