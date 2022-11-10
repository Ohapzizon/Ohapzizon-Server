import { TargetGrade } from '../enum/target-grade';
import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { GROUP_ALL_POSTS, GROUP_POST } from '../enum/group-post';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from '../../common/utils/date-time.util';
import { PostStatus } from '../enum/post-status';

@Expose({ groups: [GROUP_POST, GROUP_ALL_POSTS] })
export class ShowPostDto {
  @ApiHideProperty()
  @Exclude()
  private readonly _postId: number;

  @ApiHideProperty()
  @Exclude()
  private readonly _title: string;

  @ApiHideProperty()
  @Exclude()
  private readonly _contents: string;

  @ApiHideProperty()
  @Exclude()
  private readonly _limit: number;

  @ApiHideProperty()
  @Exclude()
  private readonly _status: PostStatus;

  @ApiHideProperty()
  @Exclude()
  private readonly _targetGrade: TargetGrade;

  @ApiHideProperty()
  @Exclude()
  private readonly _reserveDateTime: LocalDateTime;

  @ApiHideProperty()
  @Exclude()
  private readonly _createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  private readonly _updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  private readonly _writer: string;

  @ApiProperty({
    name: 'postId',
    example: 1,
  })
  @Expose({ name: 'postId ' })
  get postId(): number {
    return this._postId;
  }

  @ApiProperty({
    name: 'title',
    description: '제목',
    example: '점축 땡길 사람',
  })
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty({
    name: 'contents',
    description: '내용',
    example: '날씨가 이렇게 좋은데 안 땡기면 이건 ㄹㅇ 범죄다.',
  })
  @Expose({ groups: [GROUP_POST] })
  get contents(): string {
    return this._contents;
  }

  @ApiProperty({
    name: 'limit',
    description: '제한 인원',
    example: 16,
  })
  @Expose()
  get limit(): number {
    return this._limit;
  }

  @ApiProperty({
    name: 'status',
    description: '상태',
    example: PostStatus.OPEN,
  })
  @Expose()
  get status(): PostStatus {
    return this._status;
  }

  @ApiProperty({
    name: 'targetGrade',
    description: '대상 학년',
    example: TargetGrade.ALL,
  })
  @Expose()
  get targetGrade(): TargetGrade {
    return this._targetGrade;
  }

  @ApiProperty({
    name: 'reserveDate',
    description: '예약일자',
    example: LocalDateTime.now(),
  })
  @Expose()
  get reserveDateTime(): LocalDateTime {
    return this._reserveDateTime;
  }

  @ApiProperty({
    name: 'createdAt',
    description: '생성일자',
    example: LocalDateTime.now(),
  })
  @Expose()
  get createdAt(): LocalDateTime {
    return DateTimeUtil.toLocalDateTime(this._createdAt);
  }

  @ApiProperty({
    name: 'updatedAt',
    description: '수정일자',
    example: LocalDateTime.now(),
  })
  @Expose()
  get updatedAtAt(): LocalDateTime {
    return DateTimeUtil.toLocalDateTime(this._updatedAt);
  }

  @ApiProperty({
    name: 'writer',
    description: '작성자',
    example: '송유현',
  })
  @Expose()
  get writer(): string {
    return this._writer;
  }
}
