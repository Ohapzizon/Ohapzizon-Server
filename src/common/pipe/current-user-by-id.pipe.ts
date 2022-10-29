import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import User from '../../entities/user.entity';

@Injectable()
export class currentUserByIdPipe
  implements PipeTransform<string, Promise<User>>
{
  constructor(private readonly userService: UserService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<User> {
    return this.userService.findOneWithProfileByIdOrFail(value);
  }
}
