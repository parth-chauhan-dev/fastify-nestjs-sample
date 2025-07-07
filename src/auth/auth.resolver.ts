import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginInput, SignupInput } from "./inputs";
import { LoginOutput } from "./outputs";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => String)
    async signup(@Args('data') data: SignupInput) {
        return this.authService.signup(data);
    }

    @Mutation(() => LoginOutput)
    async login(@Args('data') data: LoginInput): Promise<LoginOutput> {
        return this.authService.login(data);
    }
}
