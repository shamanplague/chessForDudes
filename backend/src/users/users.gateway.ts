import { Logger, UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Public } from 'src/decorators/public.decorator'
import { LocalGuard } from 'src/guards/ws-local.guard'
import { AnonymousUsersPipe } from 'src/pipes/anonymous-users.pipe'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import { JwtGuard } from 'src/guards/ws-jwt.guard'

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
    if (user.isAnonymous) {
      client.emit('anonymousTokenFromServer', { token })
    } else {
      client.emit('tokenFromServer', { token })
    }
    
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }
}
