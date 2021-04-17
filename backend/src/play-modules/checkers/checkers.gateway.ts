import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway()
export class CheckersGateway {
  // @SubscribeMessage('startGame')
  // handleMessage(): void {
  //   console.log('Обрабатываем startGame')
  // }
}
