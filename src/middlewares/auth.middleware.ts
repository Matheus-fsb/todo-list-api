import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../generated/prisma/enums.js';

interface JwtPayloadDTO {
  sub: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayloadDTO;

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}
