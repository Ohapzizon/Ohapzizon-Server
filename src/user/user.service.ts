import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import User from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUserId(userId: number): Promise<User | undefined> {
    return await this.userRepository.findOneOrFail({
      userId: userId,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = this.userRepository.create({
      googleId: createUserDto.googleId,
      email: createUserDto.email,
      name: createUserDto.name,
    });
    const savedUser = await this.userRepository.save(newUser);
    return this.findByUserId(savedUser.userId);
  }

  async updateRefreshTokenById(
    userId: number,
    currentHashedRefreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(
      { userId: userId },
      {
        currentHashedRefreshToken: currentHashedRefreshToken,
      },
    );
  }

  async withdrawal(userId: number): Promise<void> {
    await this.userRepository.delete({ userId: userId });
  }
}
