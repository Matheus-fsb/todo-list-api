import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedUserDTO, JwtPayload } from '../modules/auth/auth.types.js';
import { errorResponse } from '../utils/apiResponse.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserDTO;
}

function getAccessToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.accessToken;

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return undefined;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return undefined;
  }

  return token;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = getAccessToken(req);

  if (!token) {
    return res.status(401).json(errorResponse('Unauthorized'));
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = { id: decoded.sub, role: decoded.role };

    return next();
  } catch {
    return res.status(401).json(errorResponse('Invalid or expired token'));
  }
}
