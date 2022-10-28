import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InvalidTokenError } from '../response/swagger/error/invalid-token.error';
import { JwtRefreshAuthGuard } from '../../auth/guard/jwt-refresh-auth.guard';

export function RefreshAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, JwtRefreshAuthGuard),
    ApiBearerAuth('accessToken'),
    ApiHeader({ name: 'refresh_token' }),
    ApiUnauthorizedResponse({
      description: 'Invalid Token',
      type: InvalidTokenError,
    }),
  );
}
