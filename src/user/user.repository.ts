import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/user.entity';
import { plainToClass } from 'class-transformer';
import { ShowUserDto } from './dto/show-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findShowUserDtoByUserId(
    userId: string,
  ): Promise<ShowUserDto | undefined> {
    const row = await this.findOneByUserId(userId);
    return plainToClass(ShowUserDto, row);
  }

  private async findOneByUserId(
    userId: string,
  ): Promise<ShowUserDto | undefined> {
    const qb = this.createQueryBuilder('u')
      .select(['u.userId', 'u.email', 'u.name', 'u.role'])
      .where('u.userId = :userId', { userId: userId });
    return await qb.getOne();
  }
}
