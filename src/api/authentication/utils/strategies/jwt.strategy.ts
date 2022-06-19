import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IJwtPayload,
  IJwtPayloadSigned,
} from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.accessToken.secret'),
    });
  }

  async validate(payload: IJwtPayload): Promise<IJwtPayloadSigned> {
    return {
      id: payload.sub,
      email: payload.email,
      userInfos: payload.userInfos,
    };
  }
}
