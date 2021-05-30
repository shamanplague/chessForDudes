import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import ServerEvents from 'src/websockets/server.events'
import ClientsEvents from 'src/websockets/client.events'
import { UserToken } from 'src/decorators/user-token.decorator'
import { UsersService } from 'src/users/users.service'
import { CheckersService } from 'src/play-modules/checkers/checkers.service'
import { CellCoordinate } from './classes/cell.coordinate'

@WebSocketGateway()
export class CheckersGateway {
  @WebSocketServer() 
  private server: Server

  constructor (
    private UsersService : UsersService,
    private CheckersService : CheckersService
  ) {}

  @SubscribeMessage(ServerEvents.GET_ACTIVE_CHECKERS_GAMES)
  async handleGetActiveGames(
    @ConnectedSocket() client: Socket,
    @UserToken() userToken: string
  ): Promise<void> {
    let user = await this.UsersService.findByToken(userToken)
    let games = this.CheckersService
    .getAllActiveGamesForUser(user)
    .map(item => this.CheckersService.getFormattedGame(item))

    games.forEach(item => {
      this.server.sockets.sockets[user.getSocketId()].join(`${item.gameId}`)
    })

    client.emit(ClientsEvents.GET_ACTIVE_CHECKERS_GAMES, {
      games
    })
  }

  @SubscribeMessage(ServerEvents.DEFINE_COLOR)
  async handleDefineColor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: number},//todo сделать так везде
    @UserToken() userToken: string
  ): Promise<void> {
    let usersColorIsWhite = await this.CheckersService.defineColor(userToken, payload.gameId)
    client.emit(ClientsEvents.DEFINE_COLOR, { gameId: payload.gameId, usersColorIsWhite })
  }
  
  @SubscribeMessage(ServerEvents.MAKE_MOVE)
  async handleMakeMove(
    @MessageBody() payload,
    @UserToken() userToken: string
  ): Promise<void> {
    let user = await this.UsersService.findByToken(userToken)

    if (!/^[a-h][1-8]$/.test(payload.coordinates.from) 
        || !/^[a-h][1-8]$/.test(payload.coordinates.to)) {
      throw 'Невалидный ход'
    }

    await this.CheckersService.makeMove(user.getId(), payload)
    let game = await this.CheckersService.findById(payload.gameId)

    this.server.to(`${payload.gameId}`).emit(ClientsEvents.GET_ACTUAL_GAME_STATE,
      { game: this.CheckersService.getFormattedGame(game) }
    )
  }

  @SubscribeMessage(ServerEvents.GET_AVAILABLE_MOVES)
  async handleGetAvailableMoves(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: number, coordinate: string },
    @UserToken() userToken: string
  ): Promise<void> {
    let user = await this.UsersService.findByToken(userToken)

    let cell = new CellCoordinate(payload.coordinate)
    
    let availableMoves = await this.CheckersService
    .getAvailableMoves(user, payload.gameId , cell)

    client.emit(ClientsEvents.GET_AVAILABLE_MOVES, {
      moves: availableMoves.map(item => `${item.getLetter()}${item.getNumber()}`)
    })
  }
}
