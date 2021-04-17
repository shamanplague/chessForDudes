import { UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserToken } from 'src/decorators/user-token.decorator'
import { JwtGuard } from 'src/guards/ws-jwt.guard'
import { UsersService } from 'src/users/users.service'
import { GameManagementService } from 'src/game-management/game-management.service'

@UseGuards(JwtGuard)
@WebSocketGateway()
export class GameManagementGateway {
  constructor (
    private GameService : GameManagementService,
    private UsersService : UsersService
  ) {}

  @WebSocketServer() 
  private server: Server

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @UserToken() hosterToken: string
  ) {
    await this.GameService.createGame(hosterToken)    
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameService.joinGame(user, payload.game_id, payload.asPlayer)
    this.server.emit('gameList', { games : this.GameService.getGameListForSending() })
  }

  @SubscribeMessage('leaveGame')
  async handleLeaveGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameService.leaveGame(user, payload.game_id, payload.isPlayer)
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
  
}
