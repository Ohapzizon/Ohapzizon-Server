import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InvalidTokenError } from '../response/swagger/error/invalid-token.error';
import { RegisterAuthGuard } from '../../auth/guard/register-auth.guard';

export function RegisterAuth() {
  return applyDecorators(
    UseGuards(RegisterAuthGuard),
    ApiHeader({ name: 'register_token', example: 'Bearer ' }),
    ApiUnauthorizedResponse({
      description: 'Invalid Token',
      type: InvalidTokenError,
    }),
  );
}
