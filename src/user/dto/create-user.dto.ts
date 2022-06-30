import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    name: 'googleId',
    example: '114259175033980717742',
  })
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({
    name: 'email',
    example: 'doong3373@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'name',
    example: '송유현',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
