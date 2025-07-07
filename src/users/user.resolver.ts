import { Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/guards";
import { UserListOutput } from "./dtos";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => [UserListOutput])
    async getUser() {
        return this.userService.get();
    }
}