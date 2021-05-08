import { UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserToken } from 'src/decorators/user-token.decorator'
import { JwtGuard } from 'src/guards/ws-jwt.guard'
import { UsersService } from 'src/users/users.service'
import { GameManagementService } from 'src/game-management/game-management.service'
import ClientsEvents from 'src/websockets/client.events'
import { CheckersService } from 'src/play-modules/checkers/checkers.service'

@UseGuards(JwtGuard)
@WebSocketGateway()
export class GameManagementGateway {
  constructor (
    private GameManagementService : GameManagementService,
    private UsersService : UsersService,
    private CheckersService : CheckersService
  ) {}

  @WebSocketServer() 
  private server: Server

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @UserToken() hosterToken: string
  ) {
    let game = await this.GameManagementService.createGame(hosterToken)
    let user = await this.UsersService.findByToken(hosterToken)
    this.server.sockets.sockets[user.getSocketId()].join(`${game.getId()}`)
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.server.sockets.sockets[user.getSocketId()].join(payload.game_id)
    this.GameManagementService.joinGame(user, payload.game_id, payload.asPlayer)
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('leaveGame')
  async handleLeaveGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    this.server.sockets.sockets[user.getSocketId()].leave(payload.game_id)
    this.GameManagementService.leaveGame(user, payload.game_id, payload.isPlayer)
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
  }

  @SubscribeMessage('deleteGame')
  async handleDeleteGame(
    @UserToken() clientToken: string,
    @MessageBody() payload
  ) {
    let user = await this.UsersService.findByToken(clientToken)

    Object.keys(
      this.server.nsps['/'].adapter
      .rooms[payload.game_id].sockets
    ).forEach(item => {
      this.server.sockets.sockets[item].leave(payload.game_id)
    })
    
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
    
    this.server.emit(ClientsEvents.GAME_LIST, { games : this.GameManagementService.getGameListForSending() })
    // this.server.sockets.sockets[game.getHoster().getSocketId()]
    // .emit(ClientsEvents.BACKGROUND_NOTIFICATION_FROM_SERVER, { message: 'YOUR_MOVE' })
    this.server.to(payload.game_id).emit(ClientsEvents.START_GAME, {
      new_game: await this.CheckersService.formatGameForSend(game.getId())
    })
    this.server.to(payload.game_id).emit(ClientsEvents.NOTIFICATION_FROM_SERVER, { message: `Игра №${payload.game_id} начинается` })
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
