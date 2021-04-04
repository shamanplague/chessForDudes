import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    private reflector: Reflector
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

    let verifyResult = await this.JwtService.verify(token)

    console.log('verifyResult', verifyResult)

    return verifyResult

  }
}