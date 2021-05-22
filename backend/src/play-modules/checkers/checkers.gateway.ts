import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import ServerEvents from 'src/websockets/server.events'
import ClientsEvents from 'src/websockets/client.events'
import { UserToken } from 'src/decorators/user-token.decorator'
import { UsersService } from 'src/users/users.service'
import { CheckersService } from 'src/play-modules/checkers/checkers.service'

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
    console.log('handleGetActiveGames method')
    let user = await this.UsersService.findByToken(userToken)
    let games = this.CheckersService
    .getAllActiveGamesForUser(user)
    .map(item => this.CheckersService.getFormattedGame(item))

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
    // console.log('handleDefineColor method')
    let color = await this.CheckersService.defineColor(userToken, payload.gameId)
    client.emit(ClientsEvents.DEFINE_COLOR, { color })
  }
  
  @SubscribeMessage(ServerEvents.MAKE_MOVE)
  async handleMakeMove(
    @MessageBody() payload,
    @UserToken() userToken: string
  ): Promise<void> {
    let user = await this.UsersService.findByToken(userToken)
    let currentUserSocketId = user.getSocketId()
    // console.log('Обрабатываем makeMove', payload)

    if (!/^[a-h][1-8]$/.test(payload.coordinates.from) 
        || !/^[a-h][1-8]$/.test(payload.coordinates.to)) {
      throw 'Невалидный ход'
    }

    await this.CheckersService.makeMove(user.getId(), payload)
    let game = await this.CheckersService.findById(payload.gameId)

    this.server.to(payload.gameId).emit(ClientsEvents.GET_ACTUAL_GAME_STATE,
      { game: await this.CheckersService.getFormattedGame(game) }
    )

    // let neededSocketId = game.getPlayers()
    // .find(item => item.isCheckersColorWhite() === game.isNowWhiteMove()).getSocketId()

    // this.server.sockets.sockets[neededSocketId]
    // .emit(ClientsEvents.BACKGROUND_NOTIFICATION_FROM_SERVER, { message: 'YOUR_MOVE' })



    // this.server.sockets.sockets[currentUserSocketId]
    // .emit(ClientsEvents.BACKGROUND_NOTIFICATION_FROM_SERVER,
    //   { message : 'MOVE_CONFIRMED' }
    // )
  }
}
