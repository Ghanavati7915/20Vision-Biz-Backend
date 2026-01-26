import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '8a1cfa55d50945e22f71840708649f9054d144fe', // Use environment variable in production
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}