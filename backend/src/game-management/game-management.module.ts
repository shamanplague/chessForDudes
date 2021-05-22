import { Module } from '@nestjs/common'
import { CheckersModule } from 'src/play-modules/checkers/checkers.module'
import { CheckersService } from 'src/play-modules/checkers/checkers.service'
import { UsersModule } from 'src/users/users.module'
import { GameManagementGateway } from './game-management.gateway'
import { GameManagementService } from './game-management.service'

@Module({
  imports: [ UsersModule, CheckersModule, CheckersService ],
  providers: [GameManagementGateway,
              GameManagementService],
  exports: []
})
export class GameManagementModule {}
