import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { readFileSync } from 'fs';
import { join } from 'path';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_PUBLIC_KEY_PATH')!,
            algorithms: ['RS256'],
        })
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}