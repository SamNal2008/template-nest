import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserTheme } from '../../utils/enums/user.enum';
import { IsEmail, IsEmpty, IsEnum } from 'class-validator';
import { IsStrongPassword } from '../../../../core/validators/password-validator';

export class ProfileDto {
  @ApiProperty()
  userName?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsEnum(UserTheme)
  theme?: UserTheme;

  @ApiProperty()
  @IsStrongPassword()
  password?: string;
}

export class UpdateProfileDto extends PartialType(ProfileDto) {
  @IsEmpty()
  isCompanyOwner?: boolean;
}
