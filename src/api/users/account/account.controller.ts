import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { UsersController } from '../users.controller';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IRequestWithUser } from '../../../core/utils/interfaces/request.interface';
import { ProfileDto, UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller({
  path: AccountController.END_POINT,
})
@ApiBearerAuth('JWT-auth')
@ApiTags(UsersController.END_POINT.toUpperCase())
export class AccountController {
  public static END_POINT = UsersController.END_POINT + '/account';

  constructor(private readonly accountService: AccountService) {}

  @ApiOkResponse({ description: 'Find the companies profile', type: User })
  @ApiResponse({ status: 401, description: 'Not connected' })
  @Get('my')
  async getMyUserProfile(@Req() req: IRequestWithUser): Promise<ProfileDto> {
    return this.accountService.getMyProfile(req.user.id);
  }

  @ApiOkResponse({ description: 'Find the companies profile', type: User })
  @ApiResponse({ status: 401, description: 'Not connected' })
  @Patch('my')
  async updateMyUserProfile(
    @Req() req: IRequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return this.accountService.updateMyProfile(req.user.id, updateProfileDto);
  }

  @ApiOkResponse({ description: 'Update the user password', type: User })
  @ApiResponse({ status: 401, description: 'Not connected' })
  @Patch('my/password')
  async updateMyPassword(
    @Req() request: IRequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return this.accountService.updatePasswordForUser(
      request.user.userInfos,
      updatePasswordDto,
    );
  }
}
