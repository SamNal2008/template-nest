import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class LoginDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;

  static mapper(access_token: string, user: User): LoginDto {
    return {
      access_token,
      user,
    };
  }
}
