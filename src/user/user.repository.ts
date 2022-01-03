import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import User from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUser(where: FindOneOptions<User>): Promise<User | undefined> {
    const user = await this.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }
    return user;
  }
}
