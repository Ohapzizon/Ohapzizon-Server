import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import User from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUserId(currentUserId: string): Promise<User | undefined> {
    return await this.userRepository.findOneOrFail({
      userId: currentUserId,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = this.userRepository.create({
      userId: createUserDto.userId,
      email: createUserDto.email,
      name: createUserDto.name,
    });
    const savedUser = await this.userRepository.save(newUser);
    return this.findByUserId(savedUser.userId);
  }

  async updateRefreshTokenById(
    currentUserId: string,
    currentHashedRefreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(
      { userId: currentUserId },
      {
        currentHashedRefreshToken: currentHashedRefreshToken,
      },
    );
  }

  async withdrawal(currentUserId: string): Promise<void> {
    await this.userRepository.delete({ userId: currentUserId });
  }
}
