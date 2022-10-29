import { ValueTransformer } from 'typeorm';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from '../utils/date-time.util';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(entityValue: LocalDateTime): Date {
    return DateTimeUtil.toDate(entityValue);
  }

  from(databaseValue: Date): LocalDateTime {
    return DateTimeUtil.toLocalDateTime(databaseValue);
  }
}
