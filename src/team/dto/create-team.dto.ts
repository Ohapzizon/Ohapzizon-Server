import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    name: 'bio',
    description: '짧은 자기소개',
    default: '',
  })
  @MaxLength(25)
  @IsString()
  @IsOptional()
  bio?: string;
}
