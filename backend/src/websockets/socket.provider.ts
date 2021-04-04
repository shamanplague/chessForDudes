import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets'
import { Logger, UseGuards, UsePipes } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AnonymousUsersPipe } from './pipes/AnonymousUsersPipe'
import { LocalGuard } from './guards/ws-local.guard'
import { JwtGuard } from './guards/ws-jwt.guard'
import { JwtService } from '@nestjs/jwt'
import { Public } from '../decorators/public.decorator'
import { GameService } from '../game/game.service'
import { User } from 'src/users/user'
import { UserToken } from 'src/decorators/user_token.decorator'
import { UsersService } from '../users/users.service'

@UseGuards(JwtGuard)
@WebSocketGateway()
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (
    private JwtService : JwtService,
    private GameService : GameService,
    private UsersService : UsersService
  ) {}
  @WebSocketServer() 
  server: Server

  private logger: Logger = new Logger('WebSocketGateway')

  @Public()
  @UseGuards(LocalGuard)
  @SubscribeMessage('login')
  handleLogin (
    @MessageBody(AnonymousUsersPipe) User
  ): void
  {
    const payload = { username: User.username, sub: User.id }

    let token = this.JwtService.sign(payload)
    this.UsersService.assignToken(User.username, token)
    console.log('generated token', token)
    this.server.emit('sendTokenFromServer', { token })
  }

  @SubscribeMessage('createGame')
  async handleMessage(
    @UserToken() hosterToken: string
  ) {
    let game = await this.GameService.createGame(hosterToken)
    this.server.emit('gameList', { game : this.GameService.getGameForSending(game) })
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