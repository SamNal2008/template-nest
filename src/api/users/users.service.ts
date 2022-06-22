import { Injectable, Logger } from '@nestjs/common';
import { UserRepository as UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './account/dto/update-profile.dto';
import { EmailAlreadyUsedException } from './utils/exceptions/email-already-used.exception';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IGoogleUser } from '../authentication/utils/interfaces/google-user.interface';
import { SignUpFormDto } from '../authentication/dto/sign-up.dto';
import UserNotFoundException from './utils/exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Find all users
   * @returns The list of all users
   */
  findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    return this.usersRepository.find();
  }

  /**
   * Function to find a user with its email
   * @param email The email of the user
   */
  findByEmail(email: string): Promise<User> {
    this.logger.log('Finding user with email ' + email);
    return this.usersRepository.findOneByEmail(email);
  }

  /**
   * Create a user account
   * @param {IGoogleUser} googleUser
   * @returns {Promise<User>}
   */
  async registerNewAccountForGoogleAuth(
    googleUser: IGoogleUser,
  ): Promise<User> {
    this.logger.debug(googleUser);
    await this.assertFieldsAreCorrects(googleUser);
    return this.usersRepository.save({
      isGoogleAuth: true,
      email: googleUser.email,
      userName: googleUser.displayName,
    });
  }

  async registerNewUser(signUpFormDto: SignUpFormDto): Promise<User> {
    const signUpFormDtoUpdated = await this.beforeSaveUser(signUpFormDto);
    return this.usersRepository.save(signUpFormDtoUpdated);
  }

  /**
   * Assert email is not already in use (just email for now)
   * @param formDto
   * @returns true if not in used throw otherwise
   */
  async assertFieldsAreCorrects(formDto: { email?: string }): Promise<boolean> {
    this.logger.log(
      'Checking user email is not already in use : ' + formDto.email,
    );
    if (
      formDto?.email &&
      (await this.usersRepository.isEmailAlreadyUsed(formDto.email))
    ) {
      throw new EmailAlreadyUsedException(formDto.email);
    }
    return true;
  }

  /**
   * Find one user by ID
   * @param id
   * @returns
   */
  async findById(id: string): Promise<User> {
    this.logger.log('Finding user with id : ' + id);
    const user = await this.usersRepository.findOne(id);
    if (!user) throw UserNotFoundException.withId(id);
    return user;
  }

  /**
   * Update password for user
   * @param userId
   * @param newPassword
   * @returns
   */
  public async updatePasswordForUser(
    userId: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOneOrFail(userId);
    if (!user) throw UserNotFoundException.withId(userId);
    user.password = bcrypt.hashSync(
      newPassword,
      this.configService.get('auth.hash'),
    );
    return this.usersRepository.save(user);
  }

  /**
   * Update user profile
   * @param userId
   * @param updateProfileDto
   * @returns The user updated
   */
  async updateUser(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    await this.beforeSaveUser(updateProfileDto);
    await this.usersRepository.update(userId, updateProfileDto);
    return this.usersRepository.findOne(userId);
  }

  /**
   * Hash password for security purpose
   * @param signUpFormDto
   * @returns The signup form with the password hashed
   */
  private async hashPassword(
    signUpFormDto: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    if (signUpFormDto?.password) {
      signUpFormDto.password = bcrypt.hashSync(
        signUpFormDto.password,
        this.configService.get('auth.hash'),
      );
    }
    return signUpFormDto;
  }

  /**
   * Always executed before a new user is saved
   * This function has for purpose to check if fields are correct and
   * the password is well hashed before it is saved in the database
   * @param signUpFormDto
   * @returns The signup form with hashed password if everything went well
   * throw an error otherwise
   */
  private async beforeSaveUser(
    signUpFormDto: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    await this.assertFieldsAreCorrects(signUpFormDto);
    signUpFormDto = await this.hashPassword(signUpFormDto);
    return signUpFormDto;
  }
}
