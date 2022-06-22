import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../../core/mail/mail.service';
import { TokenService } from '../../../core/security/token/token.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserEmailNotFoundException } from '../../users/utils/exceptions/user-email-not-found.exception';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from '../utils/exceptions/invalid-credentials.exception';
import { ResetPasswordDto } from '../dto/forget-password.dto';
import { EmailAlreadyUsedException } from '../../users/utils/exceptions/email-already-used.exception';
import { SignUpFormDto } from '../dto/sign-up.dto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const companiesServiceMock = {};
  const customerServiceMock = {
    registerNewUser: jest.fn(),
  };
  const usersServiceMock = {
    findByEmail: jest.fn(),
    updatePasswordForUser: jest.fn(),
    assertFieldsAreCorrects: jest.fn(),
    registerNewUser: jest.fn(),
  };
  const jwtServiceMock = {
    sign: jest.fn(),
  };
  const mailServiceMock = {
    sendEmailWithTokenToUser: jest.fn(),
  };
  const tokenServiceMock = {
    generateNewPasswordVerificationToken: jest.fn(),
    verifyPasswordTokenIsValid: jest.fn(),
  };
  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: MailService, useValue: mailServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('login', () => {
    it('should be defined', () => {
      expect.assertions(1);
      expect(service.login).toBeDefined();
    });

    it.each([
      { id: '1', email: null } as User,
      { id: null, email: 'email' } as User,
    ])(
      'should throw an invalid connection with a 401 if user infos are missing',
      (user: User) => {
        expect.assertions(1);
        expect(() => service.login(user)).toThrow(
          new UnauthorizedException('Invalid connection'),
        );
      },
    );

    it('should login user by signing its token', () => {
      expect.assertions(1);
      const userId = '1';
      const userEmail = 'email';
      service.login({ id: userId, email: userEmail } as User);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: userEmail,
        sub: userId,
        userInfos: {
          email: userEmail,
          id: userId,
        },
      });
    });
  });

  describe('validateUser', () => {
    it('should throw user not found if user is not found', async () => {
      expect.assertions(1);
      const noneExistingUser = {
        email: 'invalid email',
        password: 'password',
      };
      usersServiceMock.findByEmail.mockResolvedValue(null);
      await expect(
        service.validateUser(noneExistingUser.email, noneExistingUser.password),
      ).rejects.toThrowError(
        new UserEmailNotFoundException(noneExistingUser.email),
      );
    });

    it('should throw invalid credentials is password is invalid', async () => {
      expect.assertions(1);
      const user = { email: 'email', password: 'invalidPass' };
      usersServiceMock.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      await expect(
        service.validateUser(user.email, user.password),
      ).rejects.toThrowError(new InvalidCredentialsException(user.email));
    });

    it('should return user account if credentials are correct', async () => {
      expect.assertions(1);
      const user = { email: 'email', password: 'password' };
      usersServiceMock.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      expect(await service.validateUser(user.email, user.password)).toEqual(
        user,
      );
    });
  });

  describe('sendEmailToResetPassword', () => {
    expect.assertions(1);
    it('should throw an error if the user is not registered', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);
      await expect(
        async () => await service.sendEmailToResetPassword('email'),
      ).rejects.toThrow(new UserEmailNotFoundException('email'));
    });

    it('should send an email if the user is found', async () => {
      expect.assertions(1);
      const user = { id: 'id' };
      const token = 'token';
      usersServiceMock.findByEmail.mockResolvedValueOnce(user);
      tokenServiceMock.generateNewPasswordVerificationToken.mockResolvedValueOnce(
        token,
      );
      await service.sendEmailToResetPassword('email');
      expect(mailServiceMock.sendEmailWithTokenToUser).toHaveBeenCalledWith(
        user,
        token,
      );
    });
  });

  describe('resetPasswordWithToken', () => {
    it('should throw an error if the email user is not recognized', () => {
      expect.assertions(1);
      const notFoundEmail = 'notFoundEmail';
      usersServiceMock.findByEmail.mockResolvedValue(null);
      expect(
        service.resetPasswordWithToken({
          email: notFoundEmail,
          token: 'token',
          newPassword: 'newPass',
        }),
      ).rejects.toThrowError(new UserEmailNotFoundException(notFoundEmail));
    });

    it('should throw an error if the token is invalid', async () => {
      expect.assertions(1);
      const userEmail = 'email';
      const newPassword = 'newPassword';
      const token = 'token';
      const userId = 'id';
      const resetPasswordDto: ResetPasswordDto = {
        email: userEmail,
        newPassword,
        token,
      };
      const user = { email: userEmail, id: userId };
      usersServiceMock.findByEmail.mockResolvedValue(user);
      tokenServiceMock.verifyPasswordTokenIsValid.mockResolvedValue(false);
      await expect(
        service.resetPasswordWithToken(resetPasswordDto),
      ).rejects.toThrowError(
        new ForbiddenException(
          `Token provided invalid for email : ${resetPasswordDto.email}`,
        ),
      );
    });

    it('should update the user password if the token is valid', async () => {
      expect.assertions(1);
      const userEmail = 'email';
      const newPassword = 'newPassword';
      const token = 'token';
      const userId = 'id';
      const resetPasswordDto: ResetPasswordDto = {
        email: userEmail,
        newPassword,
        token,
      };
      const user = { email: userEmail, id: userId };
      usersServiceMock.findByEmail.mockResolvedValue(user);
      usersServiceMock.updatePasswordForUser.mockResolvedValue(user);
      tokenServiceMock.verifyPasswordTokenIsValid.mockResolvedValue(true);
      await service.resetPasswordWithToken(resetPasswordDto);
      expect(usersServiceMock.updatePasswordForUser).toHaveBeenCalledWith(
        user.id,
        resetPasswordDto.newPassword,
      );
    });
  });

  describe('registerNewUser', () => {
    it('should throw an error if user email already exist', async () => {
      expect.assertions(1);
      const userDto = { email: 'alreadyIsUseEmail' } as SignUpFormDto;
      const emailAlreadyUsedError = new EmailAlreadyUsedException(
        userDto.email,
      );
      usersServiceMock.registerNewUser.mockRejectedValue(emailAlreadyUsedError);
      await expect(service.registerNewUser(userDto)).rejects.toThrowError(
        emailAlreadyUsedError,
      );
    });

    it('should return the user account just created with password hashed', async () => {
      expect.assertions(1);
      const userDto = {
        email: 'email',
        password: 'password',
      } as SignUpFormDto;
      const hashSalt = await bcrypt.genSalt();
      const userEntity = {
        id: 'id',
        email: 'email',
        password: bcrypt.hashSync(userDto.password, hashSalt),
      } as User;
      const res = {
        access_token: undefined,
        user: userEntity,
      };
      usersServiceMock.assertFieldsAreCorrects.mockResolvedValue(true);
      usersServiceMock.registerNewUser.mockResolvedValue(userEntity);
      configServiceMock.get.mockReturnValue(hashSalt);
      await expect(service.registerNewUser(userDto)).resolves.toEqual(res);
    });
  });
});
