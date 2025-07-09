import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync(
        join(
          process.cwd(),
          configService.get<string>('JWT_PUBLIC_KEY_PATH') ?? '',
        ),
        'utf8',
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
