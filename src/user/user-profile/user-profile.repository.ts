import dataSource from '../../config/database/data-source';
import UserProfile from '../../entities/user-profile.entity';

export const userProfileRepository = dataSource
  .getRepository(UserProfile)
  .extend({
    async findOneByIdOrFail(userProfileId: string): Promise<UserProfile> {
      return userProfileRepository
        .createQueryBuilder('profile')
        .where('profile.id = :id', { id: userProfileId })
        .getOneOrFail();
    },
    async findOneByUserIdOrFail(userId: string): Promise<UserProfile> {
      return userProfileRepository
        .createQueryBuilder('profile')
        .where('user.id = :id', { id: userId })
        .innerJoin('profile.user', 'user')
        .getOneOrFail();
    },
  });
