import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import ServerEvents from 'src/websockets/server.events'

@WebSocketGateway()
export class CheckersGateway {
  @SubscribeMessage(ServerEvents.MAKE_MOVE)
  handleMakeMove(
    @MessageBody() payload
  ): void {
    console.log('Обрабатываем makeMove', payload)
  }
}
