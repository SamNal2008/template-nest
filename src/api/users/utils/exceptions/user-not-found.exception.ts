import { NotFoundException } from '@nestjs/common';

export default class UserNotFoundException extends NotFoundException {
  constructor(errorMessage: string) {
    super(errorMessage);
  }

  public static withEmail(email: string): UserNotFoundException {
    return new UserNotFoundException(`User not found with email : ${email}`);
  }

  public static withId(userId: string): UserNotFoundException {
    return new UserNotFoundException(`User not found with ID : ${userId}`);
  }
}
