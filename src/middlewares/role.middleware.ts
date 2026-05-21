// src/shared/middlewares/role.middleware.ts

import type { Response, NextFunction } from 'express';

import type { AuthenticatedRequest } from './auth.middleware.js';
import type { UserRole } from '../generated/prisma/enums.js';

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    return next();
  };
}
