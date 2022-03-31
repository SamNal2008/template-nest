import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function detailLogger(req: Request, res: Response, next: NextFunction) {

  const logger = new Logger('HTTP/HTTPS');

  const {ip, method, originalUrl} = req;

  const userAgent = req.get('user-agent') || '';

  const beforeRequest = Date.now();
  
  res.on('finish', () => {
    const { statusCode } = res;
    const afterRequest = Date.now();
    logger.log(
      `${method} on ${originalUrl} with code : ${statusCode} - ${userAgent} from ${ip} in ${afterRequest - beforeRequest}ms`
    );
  });

  next();
};
