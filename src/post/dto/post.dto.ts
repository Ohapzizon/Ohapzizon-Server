import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  title: string;
  @IsNumber()
  headCount: number;
  @IsString()
  contents: string;
  @IsBoolean()
  isDayAndNight: boolean;
}
