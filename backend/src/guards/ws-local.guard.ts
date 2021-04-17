import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from 'src/users/users.service'


@Injectable()
export class LocalGuard implements CanActivate {
  constructor(
    private UsersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    let {username, password, isAnonymous} = context.getArgByIndex(1)

    let user = await this.UsersService.findOne(username)

    if (!user) throw new UnauthorizedException()

    return Boolean(user)

  }

}