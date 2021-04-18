import { UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserToken } from 'src/decorators/user-token.decorator'
import { JwtGuard } from 'src/guards/ws-jwt.guard'
import { UsersService } from 'src/users/users.service'
import { GameManagementService } from 'src/game-management/game-management.service'
import ClientsEvents from 'src/websockets/client.events'

@UseGuards(JwtGuard)
@WebSocketGateway()
export class GameManagementGateway {
  constructor (
    private GameManagementService : GameManagementService,
    private UsersService : UsersService
  ) {}

  @WebSocketServer() 
  private server: Server

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @UserToken() hosterToken: string
  ) {
    await this.GameManagementService.createGame(hosterToken)    
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameManagementService.joinGame(user, payload.game_id, payload.asPlayer)
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('leaveGame')
  async handleLeaveGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameManagementService.leaveGame(user, payload.game_id, payload.isPlayer)
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('deleteGame')
  async handleDeleteGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.GameManagementService.deleteGame(user, payload.game_id)
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    // console.log('start payload', payload)
    let user = await this.UsersService.findByToken(clientToken)

    let game = await this.GameManagementService.startGame(user, payload.game_id)
    this.server.emit(ClientsEvents.START_GAME, { new_game: game })
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
    this.server.emit(ClientsEvents.NOTIFICATION_FROM_SERVER, { message: `Игра №${payload.game_id} начинается` })
  }

  @SubscribeMessage('gameList')
  async handleGameList() {
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }
  
  @SubscribeMessage('gameManagenentData')
  async handleGameCreatedByUser(
    @ConnectedSocket() client: Socket,
    @UserToken() userToken: string
  ) {
    let data = {
      created_games : this.GameManagementService.getGamesCreatedByUser(userToken),
      joined_games : this.GameManagementService.getGamesJoinedByUser(userToken),
      spectrated_games : this.GameManagementService.getGamesSpectratedByUser(userToken)
    }
    client.emit(ClientsEvents.GAME_MANAGEMENT_DATA, data)
  }
  
}
