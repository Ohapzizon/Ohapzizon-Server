import {
  convert,
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
  nativeJs,
} from '@js-joda/core';

export class DateTimeUtil {
  private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    'yyyy-MM-dd HH:mm:ss',
  );

  static toDate(localDate: LocalDate | LocalDateTime): Date {
    if (!localDate) return null;
    return convert(localDate).toDate();
  }

  static toLocalDateTime(date: Date): LocalDateTime {
    if (!date) return null;
    return LocalDateTime.from(nativeJs(date));
  }

  static toLocalDateTimeBy(strDate: string): LocalDateTime {
    if (!strDate) return null;
    return LocalDateTime.parse(strDate, DateTimeUtil.DATE_TIME_FORMATTER);
  }
}
