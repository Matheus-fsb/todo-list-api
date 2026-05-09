import type { UserRole } from "../../generated/prisma/enums.js";

export interface PermissionRule {
  roles: UserRole[];
}