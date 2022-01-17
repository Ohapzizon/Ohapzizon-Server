import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleCodeDto {
  @ApiProperty({
    description: '코드',
    required: true,
  })
  @IsNotEmpty({ message: '인증 코드가 입력되지 않았습니다.' })
  @IsString()
  readonly code: string;
}
