import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();

    // 👇 HTTP Request (REST or Query/Mutation)
    if (gqlContext.req) {
      console.log('Guard via HTTP headers:', gqlContext.req.headers);
      return gqlContext.req;
    }

    // 👇 WebSocket Subscription (user injected in onConnect)
    if (gqlContext.user) {
      console.log('Guard via WebSocket user:', gqlContext.user);
      return { user: gqlContext.user };
    }

    // fallback
    return {};
  }
}
