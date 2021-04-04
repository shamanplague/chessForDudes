import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserToken = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {

    let token = context
    .getArgByIndex(0)
    .handshake
    .headers
    .cookie
    .match(/(?<=userToken=).*?(?=(;|$))/)[0]
    
    return token

    // const request = ctx.switchToHttp().getRequest();
    // return request.user;
  },
)