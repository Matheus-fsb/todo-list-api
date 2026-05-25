import type { UserRole } from '../../generated/prisma/enums.js';

export type PermissionRule = {
  roles: UserRole[];
};
