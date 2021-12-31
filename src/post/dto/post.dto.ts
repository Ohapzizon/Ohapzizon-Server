import { IsNumber, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  title: string;
  @IsString()
  contents: string;
  @IsNumber()
  maxCount: number;
}
