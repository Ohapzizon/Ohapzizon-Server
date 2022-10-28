import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../../user/enum/role';
import { InvalidTokenError } from '../response/swagger/error/invalid-token.error';
import { ForbiddenError } from '../response/swagger/error/forbidden.error';

export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(JwtAuthGuard, RoleGuard),
    ApiBearerAuth('accessToken'),
    ApiUnauthorizedResponse({
      description: 'Invalid Token',
      type: InvalidTokenError,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ForbiddenError,
    }),
  );
}
