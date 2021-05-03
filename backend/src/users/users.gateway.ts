import { Logger, UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Public } from 'src/decorators/public.decorator'
import { LocalGuard } from 'src/guards/ws-local.guard'
import { AnonymousUsersPipe } from 'src/pipes/anonymous-users.pipe'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import { JwtGuard } from 'src/guards/ws-jwt.guard'
import ClientEvents from 'src/websockets/client.events'
import { UserToken } from 'src/decorators/user-token.decorator'

@UseGuards(JwtGuard)
@WebSocketGateway()
export class UsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (
    private JwtService : JwtService,
    private UsersService : UsersService
  ) {}
  private logger: Logger = new Logger('WebSocketGateway')

  @Public()
  @UseGuards(LocalGuard)
  @SubscribeMessage('login')
  handleLogin (
    @ConnectedSocket() client: Socket,
    @MessageBody(AnonymousUsersPipe) user
  ): void
  {
    const payload = { username: user.username, sub: user.id }

    let token = this.JwtService.sign(payload)
    this.UsersService.assignToken(user.username, token)
    // console.log('Ставим токен', token)
    if (user.isAnonymous) {
      client.emit(ClientEvents.ANONYMOUS_TOKEN_FROM_SERVER, { token })
    } else {
      client.emit(ClientEvents.TOKEN_FROM_SERVER, { token })
    }
    
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(
    @ConnectedSocket() client: Socket
  ) {
    let userToken = client.handshake.headers.cookie
    .match(/(?<=userToken=).*?(?=(;|$))/)[0]

    // console.log('token', userToken)

    let neededUser = await this.UsersService.findByToken(userToken)

    if (neededUser) {
      // console.log('neededUser', neededUser)
      neededUser.setSocketId(client.id)
    }

    this.logger.log(`Client connected: ${client.id}`)
  }
}
