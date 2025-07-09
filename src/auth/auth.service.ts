import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { SignupDto, LoginDto } from './dtos';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { ConflictException, Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject('PUB_SUB') private readonly pubSub: any,
  ) {}

  async signup(signupDto: SignupDto) {
    const userExists = await this.userService.findByEmail(signupDto.email);
    if (userExists) {
      throw new ConflictException('Invalid credentials');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const newUser = {
      ...signupDto,
      password: hashedPassword,
    };

    await this.userService.create(newUser);
    this.pubSub.publish('userAdded', { userAdded: newUser });
    return true;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      algorithm: 'RS256',
      expiresIn: '1h',
    });

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      token,
      expiresIn: 3600,
    };
  }
}
