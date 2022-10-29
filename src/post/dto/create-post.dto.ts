import { LocalDateTime } from '@js-joda/core';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TargetGrade } from '../enum/target-grade';
import { Expose, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { DateTimeUtil } from '../../common/utils/date-time.util';

export class CreatePostDto {
  @ApiProperty({
    name: 'title',
    default: '점축 땡길 사람',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    name: 'contents',
    default: '날씨가 이렇게 좋은데 안땡기면 이건 ㄹㅇ 범죄다.',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    name: 'limit',
    default: 16,
  })
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @ApiProperty({
    name: 'targetGrade',
    default: TargetGrade.ALL,
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum(TargetGrade)
  targetGrade: TargetGrade;

  // @ApiProperty({
  //   name: 'reserveDateTime',
  //   default: '2022-10-27 12:10:24',
  //   description: 'yyyy-MM-dd HH:mm:ss',
  // })
  @ApiHideProperty()
  @Expose()
  @IsNotEmpty()
  @Transform(({ value }) => DateTimeUtil.toLocalDateTimeBy(value))
  reserveDateTime: LocalDateTime;
}
