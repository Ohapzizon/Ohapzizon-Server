import dataSource from '../../config/database/dataSource';
import SocialAccount from '../../entities/social-account.entity';
import { isExistQuery } from '../../common/row-query/isExists';

export const socialAccountRepository = dataSource
  .getRepository(SocialAccount)
  .extend({
    findOneBySocialIdOrFail(socialId: string): Promise<SocialAccount> {
      return this.createQueryBuilder('s')
        .where('s.social_id = :socialId', { socialId: socialId })
        .innerJoinAndSelect('s.user', 'u')
        .innerJoinAndSelect('u.profile', 'p')
        .getOneOrFail();
    },

    async isExistBySocialId(
      socialId: string,
      provider: string,
    ): Promise<boolean> {
      return isExistQuery(
        this.createQueryBuilder('s')
          .select('s.id')
          .where('s.social_id = ? AND s.provider = ?')
          .getQuery(),
        [`${socialId}`, `${provider}`],
      );
    },
  });
