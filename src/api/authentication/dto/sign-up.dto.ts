import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserTheme } from '../../users/utils/enums/user.enum';
import { IsStrongPassword } from '../../../core/validators/password-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpFormDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty({
    description:
      'Password should be at least : 8 characters, 1 upper case, 1 special character and 1 number',
  })
  @IsNotEmpty()
  @IsString()
  @Exclude({ toPlainOnly: true })
  @IsStrongPassword({
    message:
      'Please provide a strong password with 8 characters, one uppercase, and at least one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User display name on the app',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty()
  @ApiProperty({ enum: UserTheme, default: UserTheme.LIGHT })
  @IsOptional()
  @IsEnum(UserTheme)
  theme: UserTheme;
}
