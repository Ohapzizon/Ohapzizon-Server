import { BadRequestException, Injectable } from '@nestjs/common';
import User from '../entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import UserProfile from '../entities/user-profile.entity';
import { EntityManager } from 'typeorm';
import { SocialProfile } from '../auth/social/types/social-profile';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import { userRepository } from './user.repository';
import { userProfileRepository } from './user-profile.repository';
import { v4 as uuidv4 } from 'uuid';
import { ShowUserProfileDto } from './dto/show-user-profile.dto';

@Injectable()
export class UserService {
  async findOneWithProfileByIdOrFail(userId: string): Promise<User> {
    return userRepository.findOneByIdOrFail(userId);
  }

  async findUserProfileByIdOrFail(
    userProfileId: string,
  ): Promise<ShowUserProfileDto> {
    const userProfile: UserProfile =
      await userProfileRepository.findUserProfileByIdOrFail(userProfileId);
    return new ShowUserProfileDto(userProfile);
  }

  async isExistByEmail(email: string): Promise<boolean> {
    return userRepository.isExistByEmail(email);
  }

  async register(
    profile: SocialProfile,
    registerUserProfileDto: RegisterUserProfileDto,
    entityManager: EntityManager,
  ): Promise<{ user: User; userProfile: UserProfile }> {
    const existUser: boolean = await this.isExistByEmail(profile.email);
    if (existUser) throw new BadRequestException('User Is Already Exists');
    const user: User = userRepository.create({
      id: uuidv4(),
      email: profile.email,
      name: profile.name,
    });
    const userProfile: UserProfile = userProfileRepository.create({
      displayName: registerUserProfileDto.displayName,
      discordTag: registerUserProfileDto.discordTag,
      grade: registerUserProfileDto.grade,
      department: registerUserProfileDto.department,
      user: { id: user.id },
    });
    if (profile.thumbnail) userProfile.thumbnail = profile.thumbnail;
    await entityManager.insert(User, user);
    await entityManager.insert(UserProfile, userProfile);
    return { user, userProfile };
  }

  async updateProfileByUserId(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<void> {
    const currentUser: User = await this.findOneWithProfileByIdOrFail(userId);
    currentUser.profile.discordTag = updateUserProfileDto.discordTag;
    currentUser.profile.displayName = updateUserProfileDto.displayName;
    await userProfileRepository.save(currentUser.profile);
  }
}
