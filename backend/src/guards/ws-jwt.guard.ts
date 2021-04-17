import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from '@nestjs/jwt'
import { WsException } from "@nestjs/websockets"
import { UsersService } from "src/users/users.service"


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    private reflector: Reflector,
    private UsersService: UsersService
  )
  {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.get<string>('isPublic', context.getHandler())

    if (isPublic) return true

    let token = context
    .getArgByIndex(0)
    .handshake
    .headers
    .cookie
    .match(/(?<=userToken=).*?(?=(;|$))/)[0]

    // console.log('token source', context
    // .getArgByIndex(0)
    // .handshake
    // .headers
    // .cookie)

    // console.log('token', token)

    try {
      await this.JwtService.verify(token)
    } catch (err) {
      throw new WsException('Token expired')
    }

    let isUserExisting = Boolean(await this.UsersService.findByToken(token))

    if (!isUserExisting) {
      throw new WsException('Unautorized')
    }

    return isUserExisting

  }
}