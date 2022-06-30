import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import User from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUserId(userId: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      userId: userId,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser: User | undefined = await this.userRepository.findOne({
      googleId: createUserDto.googleId,
    });
    const user: User = this.userRepository.create({
      googleId: createUserDto.googleId,
      email: createUserDto.email,
      name: createUserDto.name,
    });
    if (!existingUser || existingUser.name !== user.name)
      await this.userRepository.upsert(user, ['googleId']);
    return existingUser;
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
