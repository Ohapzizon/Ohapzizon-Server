import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import User from '../entities/user.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  findOneByOrFail(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    const object = super.findOneBy(where);
    if (!object) throw new NotFoundException('User Not Found');
    return object;
  }
}
