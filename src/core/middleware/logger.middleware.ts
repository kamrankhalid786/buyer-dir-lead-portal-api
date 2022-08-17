import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers;

    if (!header.authorization) {
      throw new BadRequestException('Authorization header is missing');
    }

    next();
  }
}
// TODO: implement logger middleware
