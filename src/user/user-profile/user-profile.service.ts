import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import UserProfile from '../../entities/user-profile.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowUserProfileDto } from './dto/show-user-profile.dto';
import { DATA_SOURCE } from '../../common/constants';

@Injectable()
export class UserProfileService {
  private readonly userProfileRepository: Repository<UserProfile>;
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.userProfileRepository = this.dataSource.getRepository(UserProfile);
  }

  async findShowUserProfileDtoById(
    userId: number,
  ): Promise<ShowUserProfileDto> {
    const userProfile: UserProfile =
      await this.userProfileRepository.findOneByOrFail({
        user: { id: userId },
      });
    return new ShowUserProfileDto(userProfile);
  }

  async updateProfileByUserId(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<void> {
    const profile: UserProfile =
      await this.userProfileRepository.findOneByOrFail({
        user: { id: userId },
      });
    profile.discordTag = updateUserProfileDto.discordTag;
    profile.displayName = updateUserProfileDto.displayName;
    await this.userProfileRepository.save(profile);
  }
}
