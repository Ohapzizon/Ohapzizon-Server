import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SocialProfileDto {
  @ApiProperty({ example: '114259175033980717742' })
  @Expose()
  socialId: string;

  @ApiProperty({ example: '송유현' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'doong3373@gmail.com' })
  @Expose()
  email: string;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ALm5wu2wfmlLoAS0UDsflc_pFbRz09LsGW_P30Y9uY-r=s96-c',
  })
  @Expose()
  thumbnail: string;
}
