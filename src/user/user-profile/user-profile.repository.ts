import dataSource from '../../config/database/data-source';
import UserProfile from '../../entities/user-profile.entity';

export const userProfileRepository = dataSource
  .getRepository(UserProfile)
  .extend({
    async findOneByIdOrFail(userId: number): Promise<UserProfile> {
      return userProfileRepository
        .createQueryBuilder('profile')
        .where('profile.user_id = :id', { id: userId })
        .getOneOrFail();
    },
    async findOneByUserIdOrFail(userId: number): Promise<UserProfile> {
      return userProfileRepository
        .createQueryBuilder('profile')
        .where('user.id = :id', { id: userId })
        .innerJoin('profile.user', 'user')
        .getOneOrFail();
    },
  });
