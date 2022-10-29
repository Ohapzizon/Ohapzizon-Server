import dataSource from '../config/database/data-source';
import UserProfile from '../entities/user-profile.entity';

export const userProfileRepository = dataSource
  .getRepository(UserProfile)
  .extend({
    async findUserProfileByIdOrFail(
      userProfileId: string,
    ): Promise<UserProfile> {
      return this.createQueryBuilder('p')
        .where('p.id = :id', { id: userProfileId })
        .getOneOrFail();
    },
  });
