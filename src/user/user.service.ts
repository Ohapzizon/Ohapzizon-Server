import { Injectable } from '@nestjs/common';
import User from '../entities/user.entity';
import { userRepository } from './user.repository';

@Injectable()
export class UserService {
  async findOneByIdOrFail(userId: number): Promise<User> {
    return userRepository.findOneByIdOrFail(userId);
  }

  async isExistByEmail(email: string): Promise<boolean> {
    return userRepository.isExistByEmail(email);
  }
}
