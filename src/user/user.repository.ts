import dataSource from '../config/database/data-source';
import User from '../entities/user.entity';
import { isExistQuery } from '../common/query/is-exists';

export const userRepository = dataSource.getRepository(User).extend({
  async findOneByIdOrFail(userId: string): Promise<User> {
    return userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .innerJoinAndSelect('user.profile', 'profile')
      .getOneOrFail();
  },

  async isExistByEmail(email: string): Promise<boolean> {
    return isExistQuery(
      userRepository
        .createQueryBuilder('user')
        .select('*')
        .where('user.email = ?')
        .getQuery(),
      [`${email}`],
    );
  },
});
