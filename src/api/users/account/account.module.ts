import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from '../users.module';
import { AuthenticationModule } from '../../authentication/authentication.module';

@Module({
  imports: [
    forwardRef(() => AuthenticationModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
