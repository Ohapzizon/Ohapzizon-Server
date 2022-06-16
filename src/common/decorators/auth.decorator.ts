import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '../../user/enum/role';

export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(JwtAuthGuard, RoleGuard),
    ApiBearerAuth('accessToken'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
