import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from '../helpers/get-request.helper';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = getRequest(ctx);
    return req?.user;
  },
);
