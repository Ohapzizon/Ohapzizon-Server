import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Grade } from '../enum/grade';
import { Department } from '../enum/department';
import { Exclude, Expose } from 'class-transformer';
import UserProfile from '../../../entities/user-profile.entity';

export class ShowUserProfileDto {
  @ApiHideProperty() @Exclude() private readonly _userId: number;
  @ApiHideProperty() @Exclude() private readonly _displayName: string;
  @ApiHideProperty() @Exclude() private readonly _discordTag?: string;
  @ApiHideProperty() @Exclude() private readonly _thumbnail?: string | null;
  @ApiHideProperty() @Exclude() private readonly _grade: Grade;
  @ApiHideProperty() @Exclude() private readonly _department: Department;

  constructor(private readonly userProfile: UserProfile) {
    this._userId = this.userProfile.userId;
    this._displayName = this.userProfile.displayName;
    this._discordTag = this.userProfile.discordTag;
    this._thumbnail = this.userProfile.thumbnail;
    this._grade = this.userProfile.grade;
    this._department = this.userProfile.department;
  }

  @ApiProperty({
    name: 'userId',
    example: 1,
  })
  @Expose()
  get userId(): number {
    return this._userId;
  }

  @ApiProperty({
    name: 'displayName',
    example: '송유현',
  })
  @Expose()
  get displayName(): string {
    return this._displayName;
  }

  @ApiProperty({
    name: 'thumbnail',
    example:
      'https://lh3.googleusercontent.com/a/ALm5wu2wfmlLoAS0UDsflc_pFbRz09LsGW_P30Y9uY-r=s96-c',
  })
  @Expose()
  get thumbnail(): string {
    return this._thumbnail;
  }

  @ApiProperty({
    name: 'discordTag',
    example: '송유현#1895',
  })
  @Expose()
  get discordTag(): string | null {
    return this._discordTag;
  }

  @ApiProperty({
    name: 'grade',
    enum: Grade,
    example: Grade.THIRD,
  })
  @Expose()
  get grade(): Grade {
    return this._grade;
  }

  @ApiProperty({
    name: 'department',
    enum: Department,
    example: Department.IOT,
  })
  @Expose()
  get department(): Department {
    return this._department;
  }
}
