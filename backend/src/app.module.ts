import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GameModule } from './game/game.module'
import { GatewayModule } from './websockets/socket.module'

@Module({
  imports: [GameModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
