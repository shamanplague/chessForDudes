import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway()
export class CheckersGateway {
  @SubscribeMessage('makeMove')
  handleMessage(): void {
    console.log('Обрабатываем makeMove')
  }
}
