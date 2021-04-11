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
import { Logger, UseGuards } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AnonymousUsersPipe } from './pipes/anonymous-users.pipe'
import { LocalGuard } from './guards/ws-local.guard'
import { JwtGuard } from './guards/ws-jwt.guard'
import { JwtService } from '@nestjs/jwt'
import { Public } from '../decorators/public.decorator'
import { GameService } from '../game-management/game-management.service'
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
    await this.GameService.createGame(hosterToken)    
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }

  @SubscribeMessage('joinGame')
  async handleJoinGameAsPlayer(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameService.joinGame(user, payload.game_id, payload.asPlayer)
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }

  @SubscribeMessage('deleteGame')
  async handleDeleteGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameService.deleteGame(user, payload.game_id)
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    console.log('start payload', payload)
    let user = await this.UsersService.findByToken(clientToken)

    this.GameService.startGame(user, payload.game_id)
  }

  @SubscribeMessage('gameList')
  async handleGameList(
    @UserToken() hosterToken: string
  ) {
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }
  
  @SubscribeMessage('gameManagenentData')
  async handleGameCreatedByUser(
    @ConnectedSocket() client: Socket,
    @UserToken() userToken: string
  ) {
    let data = {
      created_games : this.GameService.getGamesCreatedByUser(userToken),
      joined_games : this.GameService.getGamesJoinedByUser(userToken),
      spectrated_games : this.GameService.getGamesSpectratedByUser(userToken)
    }
    client.emit('gameManagenentData', data)
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