import { User } from '../../../users/entities/user.entity';

export interface IJwtPayloadSigned {
  id: string;
  email: string;
  userInfos: User;
}

export interface IJwtPayload {
  email: string;
  sub: string;
  userInfos: User;
}
