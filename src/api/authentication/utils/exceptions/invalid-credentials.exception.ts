import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  private static readonly ERROR_MESSAGE = 'Invalid password for email';

  constructor(email: string) {
    super(
      `${InvalidCredentialsException.ERROR_MESSAGE} : ${email}`,
      HttpStatus.UNAUTHORIZED,
    );
  }

  public static forEmail(email: string): InvalidCredentialsException {
    return new InvalidCredentialsException(email);
  }
}
