import { Controller, Post, Body } from "@nestjs/common";
import { SignupDto } from "./dtos/signup.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}