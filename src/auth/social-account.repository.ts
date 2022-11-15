import dataSource from '../config/database/data-source';
import SocialAccount from '../entities/social-account.entity';
import { isExistQuery } from '../common/query/is-exists';

export const socialAccountRepository = dataSource
  .getRepository(SocialAccount)
  .extend({
    findOneByIdOrFail(id: string): Promise<SocialAccount> {
      return socialAccountRepository
        .createQueryBuilder('socialAccount')
        .where('socialAccount.id = :id', { id: id })
        .innerJoinAndSelect('socialAccount.user', 'user')
        .innerJoinAndSelect('user.profile', 'profile')
        .getOneOrFail();
    },

    async isExistByIdAndProvider(
      socialId: string,
      provider: string,
    ): Promise<boolean> {
      return isExistQuery(
        socialAccountRepository
          .createQueryBuilder('socialAccount')
          .where('socialAccount.id = ? AND socialAccount.provider = ?')
          .getQuery(),
        [`${socialId}`, `${provider}`],
      );
    },
  });
