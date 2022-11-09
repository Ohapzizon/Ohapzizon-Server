import AuthToken from '../entities/auth-token.entity';
import dataSource from '../config/database/data-source';

export const authTokenRepository = dataSource.getRepository(AuthToken).extend({
  async findOneByIdOrFail(tokenId: string): Promise<AuthToken> {
    return authTokenRepository
      .createQueryBuilder('authToken')
      .where('authToken.id = :id', { id: tokenId })
      .where('authToken.disabled = :disabled', { disabled: false })
      .getOneOrFail();
  },
  async findOneByUserIdOrFail(userId: string): Promise<AuthToken> {
    return authTokenRepository
      .createQueryBuilder('authToken')
      .where('user.id = :id', { id: userId })
      .innerJoin('authToken.user', 'user')
      .getOneOrFail();
  },
});
