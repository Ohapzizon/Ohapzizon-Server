import { BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('UserNotFoundException', error);
  }
}
