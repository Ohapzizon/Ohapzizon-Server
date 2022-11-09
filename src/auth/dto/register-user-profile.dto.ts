import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Grade } from '../../user/user-profile/enum/grade';
import { Department } from '../../user/user-profile/enum/department';

export class RegisterUserProfileDto {
  @ApiProperty({
    name: 'displayName',
    example: '송유현',
  })
  @MaxLength(7, { message: '7자 내외로 작성 부탁드립니다.' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    name: 'discordTag',
    example: '송유현#1895',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  discordTag?: string;

  @ApiProperty({
    name: 'grade',
    enum: Grade,
    example: Grade.THIRD,
  })
  @IsEnum(Grade)
  @IsNotEmpty()
  grade: Grade;

  @ApiProperty({
    name: 'department',
    enum: Department,
    example: Department.IOT,
  })
  @IsEnum(Department)
  @IsNotEmpty()
  department: Department;
}
