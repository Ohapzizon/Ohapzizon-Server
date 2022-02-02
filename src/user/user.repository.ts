import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import User from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUser(where: FindOneOptions<User>): Promise<User> {
    const user = await this.findOne(where);
    if (!user) {
      throw new NotFoundException(`해당하는 사용자가 존재하지 않습니다.`);
    }
    return user;
  }
}
