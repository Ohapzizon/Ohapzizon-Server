import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InvalidTokenError } from '../response/swagger/error/invalid-token.error';
import { SocialRegisterAuthGuard } from '../../auth/guard/social-register-auth.guard';

export function SocialRegisterAuth() {
  return applyDecorators(
    UseGuards(SocialRegisterAuthGuard),
    ApiHeader({ name: 'register_token', example: 'Bearer ' }),
    ApiUnauthorizedResponse({
      description: 'Invalid Token',
      type: InvalidTokenError,
    }),
  );
}
