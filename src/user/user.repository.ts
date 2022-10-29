import dataSource from '../config/database/data-source';
import User from '../entities/user.entity';
import { isExistQuery } from '../common/row-query/is-exists';

export const userRepository = dataSource.getRepository(User).extend({
  async findOneByIdOrFail(userId: string): Promise<User> {
    return this.createQueryBuilder('u')
      .innerJoinAndSelect('u.profile', 'p')
      .where('u.id = :id', { id: userId })
      .getOneOrFail();
  },

  async isExistByEmail(email: string): Promise<boolean> {
    return isExistQuery(
      this.createQueryBuilder('u')
        .select('u.id')
        .where('u.email = ?')
        .getQuery(),
      [`${email}`],
    );
  },
});
