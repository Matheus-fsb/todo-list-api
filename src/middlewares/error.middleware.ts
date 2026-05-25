import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { errorResponse } from '../utils/apiResponse.js';

export function errorMiddleware(error: Error, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(errorResponse(error.message));
  }

  if (error instanceof ZodError) {
    return res.status(400).json(errorResponse('Validation error', error.issues));
  }

  console.error(error);
  return res.status(500).json(errorResponse('Internal server error'));
}
