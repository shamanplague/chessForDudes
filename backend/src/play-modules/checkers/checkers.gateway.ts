import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
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
    private CheckersService : CheckersService,
  ) {}
  
  @SubscribeMessage(ServerEvents.MAKE_MOVE)
  async handleMakeMove(
    @MessageBody() payload,
    @UserToken() userToken: string
  ): Promise<void> {
    let currentUserSocketId = (await this.UsersService.findByToken(userToken)).getSocketId()
    console.log('Обрабатываем makeMove', payload)

    if (!/^[a-h][1-8]$/.test(payload.coordinates.from) 
        || !/^[a-h][1-8]$/.test(payload.coordinates.to)) {
      throw 'Невалидный ход'
    }

    this.CheckersService.makeMove(payload)

    this.server.emit(ClientsEvents.ACTIVE_GAMES,
      { game: await this.CheckersService.formatGameForSend(payload.gameId) }
    )

    // this.server.sockets.sockets[currentUserSocketId]
    // .emit(ClientsEvents.BACKGROUND_NOTIFICATION_FROM_SERVER,
    //   { message : 'MOVE_CONFIRMED' }
    // )
  }
}
