import { IsString } from 'class-validator';

export class PostDto {
  @IsString()
  title: string;
  @IsString()
  contents: string;
}
