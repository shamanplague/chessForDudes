import { Module } from '@nestjs/common'
import { CheckersService } from './checkers.service'
import { CheckersGateway } from './checkers.gateway'
import { GameManagementModule } from 'src/game-management/game-management.module'

@Module({
  imports: [ GameManagementModule ],
  providers: [ CheckersGateway]
})
export class CheckersModule {}
