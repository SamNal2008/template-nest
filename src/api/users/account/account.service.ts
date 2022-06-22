import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { ProfileDto, UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthenticationService } from '../../authentication/authentication.service';
import UserNotFoundException from '../utils/exceptions/user-not-found.exception';

@Injectable()
export class AccountService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  /**
   * Will update the user profile searching if he is a classic customers or a company
   * @param {string} userId
   * @param updateProfileDto
   * @returns {Promise<User>}
   */
  public async updateMyProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    await this.usersService.assertFieldsAreCorrects(updateProfileDto);
    const user = await this.usersService.findById(userId);
    if (!user) throw UserNotFoundException.withId(userId);
    return this.usersService.updateUser(userId, updateProfileDto);
  }

  /**
   * Return the user profile and it will load the picture if its a company
   * @param {string} userId
   * @returns {Promise<User>}
   */
  public async getMyProfile(userId: string): Promise<ProfileDto> {
    return await this.usersService.findById(userId);
  }

  /**
   * Update the user password
   * @param {User} user
   * @param {UpdatePasswordDto} updatePasswordDto
   * @returns {Promise<User>}
   */
  public async updatePasswordForUser(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    await this.authenticationService.validateUser(
      user.email,
      updatePasswordDto.oldPassword,
    );
    return this.usersService.updatePasswordForUser(
      user.id,
      updatePasswordDto.newPassword,
    );
  }
}
