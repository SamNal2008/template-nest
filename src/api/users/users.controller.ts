import { Controller, Get, Logger, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { IRequestWithUser } from '../../core/utils/interfaces/request.interface';

@ApiBearerAuth('JWT-auth')
@ApiTags(UsersController.END_POINT.toUpperCase())
@Controller(UsersController.END_POINT)
export class UsersController {
  public static readonly END_POINT = 'users';

  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint to retrieve all the users
   * @returns {Promise<User[]>} The array containing all the users
   */
  @Get()
  retrieveAllUsers(): Promise<User[]> {
    this.logger.log(`Finding all users`);
    return this.usersService.findAll();
  }

  /**
   * Endpoint to retrieve one user by its UUID
   * @param {string} uuid User ID
   * @returns {Promise<User>} The promise of the user (can be null)
   */
  @Get('find/:uuid')
  retrieveUserByUUID(@Param('uuid') uuid: string): Promise<User> {
    this.logger.debug(`Finding user with UUID : ${uuid}`);
    return this.usersService.findById(uuid);
  }

  @Get('user')
  getUserByToken(@Req() req: IRequestWithUser): Promise<User> {
    return this.usersService.findById(req.user.id);
  }
}
