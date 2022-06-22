import { Module } from '@nestjs/common';
import { MailModule } from '../../core/mail/mail.module';
import { SecurityModule } from '../../core/security/security.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { GoogleStrategy } from './utils/strategies/google.strategy';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { LocalStrategy } from './utils/strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    SecurityModule,
    MailModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
