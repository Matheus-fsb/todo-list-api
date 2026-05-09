// src/modules/auth/authRequest.ts

import type { Request } from 'express';
import type { AuthenticatedUserDTO } from './auth.types.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserDTO;
}