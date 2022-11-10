import { Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { userProfileRepository } from './user-profile.repository';
import UserProfile from '../../entities/user-profile.entity';

@Injectable()
export class UserProfileService {
  async findOneByIdOrFail(userProfileId: string): Promise<UserProfile> {
    return userProfileRepository.findOneByIdOrFail(userProfileId);
  }

  async updateProfileByUserId(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<void> {
    const profile: UserProfile =
      await userProfileRepository.findOneByUserIdOrFail(userId);
    profile.discordTag = updateUserProfileDto.discordTag;
    profile.displayName = updateUserProfileDto.displayName;
    await userProfileRepository.save(profile);
  }
}
