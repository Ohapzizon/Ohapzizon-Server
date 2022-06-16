import { Role } from '../../user/enum/role';

export const matchRoles = (roles: string[], userRoles: Role) => {
  return roles.some((role) => role === userRoles);
};
