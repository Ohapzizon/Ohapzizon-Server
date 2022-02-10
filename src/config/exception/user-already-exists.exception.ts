import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('UserAlreadyExistsException', HttpStatus.CONFLICT);
  }
}
