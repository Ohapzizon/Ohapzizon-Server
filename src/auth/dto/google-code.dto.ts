import { IsString } from 'class-validator';

export class GoogleCodeDto {
  @IsString()
  readonly code: string;
}
