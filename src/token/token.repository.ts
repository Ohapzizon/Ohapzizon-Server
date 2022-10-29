import AuthToken from '../entities/auth-token.entity';
import dataSource from '../config/database/data-source';

export const authTokenRepository = dataSource.getRepository(AuthToken).extend({
  async findOneByIdOrFail(tokenId: string): Promise<AuthToken> {
    return this.createQueryBuilder('a')
      .where('a.id = :id', { id: tokenId })
      .where('a.disabled = :disabled', { disabled: false })
      .getOneOrFail();
  },
  async findOneByUserId(userId: string): Promise<AuthToken | null> {
    return this.createQueryBuilder('a')
      .where('u.id = :id', { id: userId })
      .innerJoin('a.user', 'u')
      .getOne();
  },
});
