import { Inject, Injectable } from '@nestjs/common';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { USER_REPOSITORY } from '../common/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async findOneByIdOrFail(userId: number): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { id: userId },
      loadEagerRelations: true,
      loadRelationIds: false,
    });
  }
}
