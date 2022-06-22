import { NotFoundException } from '@nestjs/common';

export class UserEmailNotFoundException extends NotFoundException {
  private static readonly ERROR_MESSAGE = 'This email does not exist';

  constructor(email: string) {
    super(`${UserEmailNotFoundException.ERROR_MESSAGE} : ${email}`);
  }
}
