import { ApiProperty } from '@nestjs/swagger';
import { MealTime } from '../../entities/post.entity';
import BaseResponse from '../../common/response/base.response';

export class ShowPostDto {
  @ApiProperty({
    name: 'postIdx',
    example: 1,
  })
  idx: number;

  @ApiProperty({
    name: 'title',
    example: '점축땡?',
  })
  title: string;

  @ApiProperty({
    name: 'contents',
    example: '날씨가 이렇게 좋은데 안땡기면 이건 ㄹㅇ 범죄다.',
  })
  contents: string;

  @ApiProperty({
    enumName: 'mealTime',
    enum: MealTime,
    example: MealTime.LUNCH,
  })
  mealTime: MealTime;

  @ApiProperty({
    name: 'maxCount',
    example: 16,
  })
  maxCount: number;

  @ApiProperty({
    name: 'writer',
    example: '3409송유현',
  })
  writer: string;
}

export class FindOnePostResDto extends BaseResponse<ShowPostDto> {
  @ApiProperty({
    type: () => ShowPostDto,
  })
  data!: ShowPostDto;
}

export class FindAllPostResDto extends BaseResponse<ShowPostDto[]> {
  @ApiProperty({
    type: () => [ShowPostDto],
  })
  data!: ShowPostDto[];
}
