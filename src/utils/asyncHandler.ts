import type { Request, Response, NextFunction } from 'express';

export const asyncHandler =
  <TRequest extends Request = Request, T = unknown>(
    fn: (req: TRequest, res: Response, next: NextFunction) => Promise<T>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as TRequest, res, next)).catch(next);
  };
