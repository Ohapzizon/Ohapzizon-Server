import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import UserProfile from '../../entities/user-profile.entity';
import { Repository } from 'typeorm';
import { ShowUserProfileDto } from './dto/show-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @Inject('USER_PROFILE_REPOSITORY')
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async findShowUserProfileDtoById(
    userId: number,
  ): Promise<ShowUserProfileDto> {
    const userProfile: UserProfile =
      await this.userProfileRepository.findOneByOrFail({ userId: userId });
    return new ShowUserProfileDto(userProfile);
  }

  async updateProfileByUserId(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<void> {
    const profile: UserProfile =
      await this.userProfileRepository.findOneByOrFail({ userId: userId });
    profile.discordTag = updateUserProfileDto.discordTag;
    profile.displayName = updateUserProfileDto.displayName;
    await this.userProfileRepository.save(profile);
  }
}
