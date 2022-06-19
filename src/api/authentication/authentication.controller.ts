import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../core/security/security.module';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpFormDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './utils/guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';
import {
  ILoginRequestWithUser,
  IRequestWithGoogleUser,
  IRequestWithUser,
} from '../../core/utils/interfaces/request.interface';
import { AuthGuard } from '@nestjs/passport';

@ApiTags(AuthenticationController.END_POINT.toUpperCase())
@Controller(AuthenticationController.END_POINT)
export class AuthenticationController {
  private static readonly END_POINT = 'auth';

  private logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @ApiCreatedResponse({
    description: 'Endpoint to sign up new user',
    type: 'LoginDto',
  })
  @Post('sign-up')
  async signUp(@Body() signupForm: SignUpFormDto): Promise<LoginDto> {
    this.logger.log(`New user sign up with email: ${signupForm.email}`);
    return this.authenticationService.registerNewUser(signupForm);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    description: 'User email and password to sign in',
    type: SignInDto,
  })
  @Post('sign-in')
  async signIn(@Req() req: ILoginRequestWithUser): Promise<LoginDto> {
    this.logger.log(`New sign in for user : ${req.user.id}`);
    this.logger.debug(JSON.stringify(req.user));
    return this.authenticationService.loginAndGetProfile(req.user);
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleAuth(): void {
    return;
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  googleAuthRedirect(@Req() req: IRequestWithGoogleUser): Promise<LoginDto> {
    return this.authenticationService.googleLogin(req.user);
  }

  @Public()
  @ApiNoContentResponse({
    description:
      'Generate an email with a temporary code reinitialize password',
  })
  @Post('send-email-to-reset-password')
  async sendEmailToResetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<void> {
    this.logger.log(
      `Sending new email to reset password for email : ${forgetPasswordDto.email}`,
    );
    await this.authenticationService.sendEmailToResetPassword(
      forgetPasswordDto.email,
    );
  }

  @Public()
  @ApiOkResponse({
    description: 'Verify if code received is valid to create new password',
  })
  @Post('reset-password-with-token')
  resetPasswordWithToken(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<LoginDto> {
    this.logger.log(`Resetting password for email : ${resetPasswordDto.email}`);
    return this.authenticationService.resetPasswordWithToken(resetPasswordDto);
  }
}
