import { Request, Response, NextFunction } from 'express';

export function detailLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`Middleware`);
  next();
};
