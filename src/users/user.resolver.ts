import { Context, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/framework/guards';
import { UserListOutput } from './dtos';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/framework/decorators';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserListOutput])
  async getUser(@CurrentUser() user): Promise<UserListOutput[]> {
    return this.userService.get(user);
  }

  @Subscription(() => UserListOutput)
  userAdded() {
    return this.pubSub.asyncIterableIterator('userAdded');
  }
}
