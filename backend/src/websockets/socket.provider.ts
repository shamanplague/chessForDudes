import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets'
import { Body, HostParam, Logger, Param, ParseBoolPipe, Query, Req, UseGuards, UsePipes } from '@nestjs/common'
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
    @ConnectedSocket() client: Socket,
    @MessageBody(AnonymousUsersPipe) user
  ): void
  {
    const payload = { username: user.username, sub: user.id }

    let token = this.JwtService.sign(payload)
    this.UsersService.assignToken(user.username, token)
    // console.log('generated token', token)
    if (user.isAnonymous) {
      client.emit('anonymousTokenFromServer', { token })
    } else {
      client.emit('tokenFromServer', { token })
    }
    
  }

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @UserToken() hosterToken: string
  ) {
    let game = await this.GameService.createGame(hosterToken)    
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }

  @SubscribeMessage('gameList')
  async handleGameList(
    @UserToken() hosterToken: string
  ) {
    // console.log('Отправляем игры', this.GameService.getGameListForSending(hosterToken))
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }
  
  @SubscribeMessage('gameCreatedByUser')
  async handleGameCreatedByUser(
    @ConnectedSocket() client: Socket,
    @UserToken() userToken: string
  ) {
    client.emit('gameCreatedByUser', { games : this.GameService.getGamesCreatedByUser(userToken) })
  }

  @SubscribeMessage('gameJoinedByUser')
  async handleGameJoinedByUser(
    @ConnectedSocket() client: Socket,
    @UserToken() userToken: string
  ) {
    client.emit('gameJoinedByUser', { games : this.GameService.getGamesJoinedByUser(userToken) })
  }

  @SubscribeMessage('joinGame')
  async handleJoinGameAsPlayer(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    console.log('payload', payload)
    let user = await this.UsersService.findByToken(clientToken)
    console.log('тип', typeof payload.asPlayer)

    this.GameService.joinGame(user, payload.game_id, payload.asPlayer)
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
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