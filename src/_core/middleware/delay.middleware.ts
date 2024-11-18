import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DelayMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const delay = parseInt(req.query?.delay as string) || 0;
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return next();
    }
    next();
  }
}
