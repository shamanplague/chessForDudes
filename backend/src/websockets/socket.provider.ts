import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets'
import { Logger, Req, UseGuards, UsePipes } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AnonymousUsersPipe } from './pipes/anonymous-users.pipe'
import { LocalGuard } from './guards/ws-local.guard'
import { JwtGuard } from './guards/ws-jwt.guard'
import { JwtService } from '@nestjs/jwt'
import { Public } from '../decorators/public.decorator'
import { GameService } from '../game/game.service'
import { User } from 'src/users/user'
import { UserToken } from 'src/decorators/user-token.decorator'
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
  private server: Server

  private logger: Logger = new Logger('WebSocketGateway')

  @Public()
  @UseGuards(LocalGuard)
  @SubscribeMessage('login')
  handleLogin (
    @Req() client: Socket,
    @MessageBody(AnonymousUsersPipe) user
  ): void
  {
    const payload = { username: user.username, sub: user.id }

    let token = this.JwtService.sign(payload)
    this.UsersService.assignToken(user.username, token)
    console.log('generated token', token)
    client.emit('tokenFromServer', { token })
  }

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @Req() client: Socket,
    @UserToken() hosterToken: string
  ) {
    let game = await this.GameService.createGame(hosterToken)

    // console.log('Создали', game)

    // console.log('this.server.clients()', this.server.clients().connected)
    
    this.server.emit('gameList', { games : this.GameService.getGameListForSending(hosterToken) })
  }

  @SubscribeMessage('gameList')
  async handleGameList(
    @UserToken() hosterToken: string
  ) {
    // console.log('Отправляем игры', this.GameService.getGameListForSending(hosterToken))
    this.server.emit('gameList', { games : this.GameService.getGameListForSending(hosterToken) })
  }
  
  @SubscribeMessage('gameCreatedByUser')
  async handleGameCreatedByUser(
    @Req() client: Socket,
    @UserToken() userToken: string
  ) {
    client.emit('gameCreatedByUser', { games : this.GameService.getGamesCreatedByUser(userToken) })
  }

  @SubscribeMessage('joinGameAsPlayer')
  async handleJoinGameAsPlayer(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)
    console.log('payload', payload)
    console.log(`User ${user.getId()} want to join`)
  }

  @SubscribeMessage('joinGameAsSpectrator')
  async handleJoinGameAsSpectrator(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)
    console.log('payload', payload)
    console.log(`User ${user.getId()} want to join`)
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