import { Inject, Injectable } from '@nestjs/common';
import User from '../entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(@Inject() private userRepository: UserRepository) {}
  async findOneByIdOrFail(userId: number): Promise<User> {
    return this.userRepository.findOneByOrFail({ id: userId });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email: email });
  }
}
