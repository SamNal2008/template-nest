import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../core/mail/mail.service';
import { UserEmailNotFoundException } from '../users/utils/exceptions/user-email-not-found.exception';
import { TokenService } from '../../core/security/token/token.service';
import { InvalidCredentialsException } from './utils/exceptions/invalid-credentials.exception';
import { SignUpFormDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { ResetPasswordDto } from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { IGoogleUser } from './utils/interfaces/google-user.interface';
import { IJwtPayload } from './utils/interfaces/jwt-payload.interface';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Check if a password provided is the one of the selected user
   * @param {User} user
   * @param {string} password
   * @param {string} email
   * @private
   */
  private static assertPasswordIsValidForUser(
    user: User,
    password: string,
    email: string,
  ): void {
    if (!bcrypt.compareSync(password, user.password)) {
      throw InvalidCredentialsException.forEmail(email);
    }
  }

  /**
   * Validate user => Check if email exists and if password is valid
   * for email provided
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async validateUser(email: string, password: string): Promise<User> {
    const wantedUser = await this.usersService.findByEmail(email);
    if (!wantedUser) throw new UserEmailNotFoundException(email);
    AuthenticationService.assertPasswordIsValidForUser(
      wantedUser,
      password,
      email,
    );
    return wantedUser;
  }

  /**
   * Check if user exists before returning payload with uer infos
   * @param {User} user
   * @returns {string}
   */
  login(user: User): string {
    if (!(user?.email && user?.id)) {
      throw new UnauthorizedException('Invalid connection');
    }

    this.logger.log(
      `New connection for user : ${user.id} with email : ${user.email}`,
    );

    const payload: IJwtPayload = {
      email: user.email,
      sub: user.id,
      userInfos: user,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Send email to resend password
   * @param email
   * @returns "OK" if everything went well otherwise it throws an error
   */
  public async sendEmailToResetPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UserEmailNotFoundException(email);
    const token = await this.tokenService.generateNewPasswordVerificationToken(
      user.id,
    );
    await this.mailService.sendEmailWithTokenToUser(user, token);
  }

  /**
   * Register new customers
   * @param signUpFormDto
   * @returns The customer user account information
   */
  public async registerNewUser(
    signUpFormDto: SignUpFormDto,
  ): Promise<LoginDto> {
    this.logger.log(
      `New registration for user : ${signUpFormDto.userName} with email : ${signUpFormDto.email}`,
    );
    const newUserAccount = await this.usersService.registerNewUser(
      signUpFormDto,
    );
    this.logger.log(
      `Account successfully created for user : ${newUserAccount.id} with email : ${newUserAccount.email}`,
    );
    return this.loginAndGetProfile(newUserAccount);
  }

  /**
   * Update password if token received is valid
   * @param {ResetPasswordDto} resetPasswordDto
   * @returns {Promise<User>}
   */
  public async resetPasswordWithToken(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<LoginDto> {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) throw new UserEmailNotFoundException(resetPasswordDto.email);
    const isTokenValid = await this.tokenService.verifyPasswordTokenIsValid(
      user.id,
      resetPasswordDto.token,
    );
    if (!isTokenValid) {
      this.logger.warn(
        `Invalid token for resetting password : ${resetPasswordDto.email}`,
      );
      throw new ForbiddenException(
        `Token provided invalid for email : ${resetPasswordDto.email}`,
      );
    }
    const userWithNewPassword = await this.usersService.updatePasswordForUser(
      user.id,
      resetPasswordDto.newPassword,
    );
    return this.loginAndGetProfile(userWithNewPassword);
  }

  /**
   * Login and return the profile of the user
   * @param {User} user
   * @returns {Promise<LoginDto>}
   */
  public async loginAndGetProfile(user: User): Promise<LoginDto> {
    return LoginDto.mapper(this.login(user), user);
  }

  /**
   * Google signup or sign in
   * @param {IGoogleUser} googleUser
   * @returns {LoginDto}
   */
  async googleLogin(googleUser: IGoogleUser): Promise<LoginDto> {
    if (!googleUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const existingUser = await this.usersService.findByEmail(googleUser.email);
    if (existingUser) {
      return this.loginAndGetProfile(existingUser);
    }
    const newAccount = await this.usersService.registerNewAccountForGoogleAuth(
      googleUser,
    );
    if (!newAccount) {
      this.logger.error('No account created for google user');
      throw new InternalServerErrorException('No new account for google login');
    }
    return this.loginAndGetProfile(newAccount);
  }
}
