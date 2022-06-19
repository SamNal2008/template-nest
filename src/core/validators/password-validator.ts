import { registerDecorator, ValidationOptions } from 'class-validator';

interface PasswordSpec {
  minLength: number;
  shouldHaveUpperCase: boolean;
  shouldHaveLowerCase: boolean;
  shouldHaveSpecialCharacter: boolean;
  shouldHaveDigits: boolean;
}

const defaultPasswordSpec: PasswordSpec = {
  minLength: 8,
  shouldHaveDigits: true,
  shouldHaveLowerCase: true,
  shouldHaveSpecialCharacter: true,
  shouldHaveUpperCase: true,
};

export const isStrongPassword = (
  password: string,
  passwordSpec: PasswordSpec = defaultPasswordSpec,
): boolean => {
  if (!password) {
    return false;
  }

  if (password.length < passwordSpec.minLength) {
    return false;
  }

  if (passwordSpec.shouldHaveUpperCase && !/[A-Z]/.test(password)) {
    return false;
  }

  if (passwordSpec.shouldHaveUpperCase && !/[a-z]/.test(password)) {
    return false;
  }

  if (passwordSpec.shouldHaveDigits && !/\d/.test(password)) {
    return false;
  }

  return !(
    passwordSpec.shouldHaveSpecialCharacter &&
    !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
  );
};

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string): void {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: (value): boolean | Promise<boolean> => {
          return isStrongPassword(value);
        },
      },
    });
  };
}
