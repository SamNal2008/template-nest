import { User } from '../../entities/user.entity';
import { UserTheme } from '../enums/user.enum';
import { RandomGeneratorFactory } from '../../../../core/utils/functions/random-generator-factory';

export const SAMYN: User = {
  id: 'UserId1',
  userName: 'Samy Nalbandian',
  isActive: true,
  email: RandomGeneratorFactory.email(),
  theme: UserTheme.LIGHT,
  isGoogleAuth: false,
  password: 'password',
} as User;

export const EVANH: User = {
  id: RandomGeneratorFactory.UUID(),
  userName: 'Evan Hays',
  isActive: true,
  email: RandomGeneratorFactory.email('gmail', 'com'),
  theme: UserTheme.DARK,
  isGoogleAuth: true,
} as User;

export const THEOL: User = {
  id: 'UserId3',
  password: 'password2',
  theme: RandomGeneratorFactory.randomEnum(UserTheme),
  userName: 'Theo Laviron',
  email: RandomGeneratorFactory.email('outlook', 'fr'),
  isActive: true,
  isGoogleAuth: false,
} as User;

export const USER_DATA: User[] = [SAMYN, EVANH, THEOL];
