import { User as UserEntity } from '../../../api/users/entities/user.entity';
import { Request } from 'express';
import { IGoogleUser } from '../../../api/authentication/utils/interfaces/google-user.interface';

export interface IRequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    userInfos: UserEntity;
  };
}

export interface ILoginRequestWithUser extends Request {
  user?: UserEntity;
}

export interface IRequestWithGoogleUser extends Request {
  user?: IGoogleUser;
}
