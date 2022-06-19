import { ConflictException } from '@nestjs/common';

export class EmailAlreadyUsedException extends ConflictException {
  private static readonly ERROR_MESSAGE = 'This email is already in use';

  constructor(email: string) {
    super(`${EmailAlreadyUsedException.ERROR_MESSAGE} : ${email}`);
  }
}
