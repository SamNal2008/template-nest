import { BadGatewayException, CallHandler, ExecutionContext, Injectable, InternalServerErrorException, Logger, NestInterceptor, NotImplementedException } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((err: any) => {
      this.logger.debug(err);
      throw throwError(() => new BadGatewayException())
    }));
  }
}
