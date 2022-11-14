import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UserService } from '../user.service';
import User from '../../entities/user.entity';

@Injectable()
export class userByIdPipe implements PipeTransform<number, Promise<User>> {
  constructor(private readonly userService: UserService) {}

  async transform(value: number, metadata: ArgumentMetadata): Promise<User> {
    return this.userService.findOneByIdOrFail(value);
  }
}
