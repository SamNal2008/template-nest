import {
  BadGatewayException,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { InvalidCredentialsException } from '../../api/authentication/utils/exceptions/invalid-credentials.exception';
import { EmailAlreadyUsedException } from '../../api/users/utils/exceptions/email-already-used.exception';

@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  private logger = new Logger(GlobalExceptionInterceptor.name);

  private errorsThatShouldNotBeCaught = [
    BadRequestException,
    NotFoundException,
    EmailAlreadyUsedException,
    InvalidCredentialsException,
    UnauthorizedException,
    InternalServerErrorException,
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: Error) => {
        this.logger.warn(`${err.name} : ${err.message}`);
        this.logger.error(JSON.stringify(err, null, 2));
        this.logger.debug(JSON.stringify(err.stack, null, 2));
        return this.isErrorKnown(err)
          ? throwError(() => err)
          : throwError(() => new BadGatewayException());
      }),
    );
  }

  private isErrorKnown(error: Error): boolean {
    for (const exception of this.errorsThatShouldNotBeCaught) {
      if (error instanceof exception) {
        return true;
      }
    }
    return false;
  }
}
