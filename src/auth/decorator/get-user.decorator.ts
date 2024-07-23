import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express'; // Import the Request type from 'express'

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Request & { user: any } = ctx // Update the type of 'request' to include 'user' property
      .switchToHttp()
      .getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
