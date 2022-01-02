import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({
    name: 'title',
    default: '점축 땡길사람'
  })
  @IsString()
  title: string;
  @ApiProperty({
    name: 'contents',
    default: '날씨가 이렇게 좋은데 안땡기면 이건 ㄹㅇ 범죄다'
  })
  @IsString()
  contents: string;
  @ApiProperty({
    name: 'maxCount',
    default: '13',
  })
  @IsNumber()
  maxCount: number;
}
