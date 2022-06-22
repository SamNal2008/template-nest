import { CustomDecorator, Module, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../api/authentication/utils/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './token/token.service';
import { IJwtConfig } from '../utils/interfaces/security.interface';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): IJwtConfig => ({
        secret: config.get('auth.jwt.accessToken.secret'),
        signOptions: {
          expiresIn: config.get('auth.jwt.accessToken.expiresIn'),
        },
      }),
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  exports: [JwtModule, PassportModule, TokenService],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TokenService,
  ],
})
export class SecurityModule {}
