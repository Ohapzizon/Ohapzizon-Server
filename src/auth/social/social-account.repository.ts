import dataSource from '../../config/database/data-source';
import SocialAccount from '../../entities/social-account.entity';
import { isExistQuery } from '../../common/query/is-exists';

export const socialAccountRepository = dataSource
  .getRepository(SocialAccount)
  .extend({
    findOneBySocialIdOrFail(socialId: string): Promise<SocialAccount> {
      return socialAccountRepository
        .createQueryBuilder('socialAccount')
        .where('socialAccount.social_id = :socialId', { socialId: socialId })
        .innerJoinAndSelect('socialAccount.user', 'user')
        .innerJoinAndSelect('user.profile', 'profile')
        .getOneOrFail();
    },

    async isExistBySocialIdAndProvider(
      socialId: string,
      provider: string,
    ): Promise<boolean> {
      return isExistQuery(
        socialAccountRepository
          .createQueryBuilder('socialAccount')
          .select('socialAccount.id')
          .where('socialAccount.social_id = ? AND socialAccount.provider = ?')
          .getQuery(),
        [`${socialId}`, `${provider}`],
      );
    },
  });
