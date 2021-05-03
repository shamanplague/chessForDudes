import { Module } from '@nestjs/common'
import { CheckersService } from 'src/play-modules/checkers/checkers.service'
import { UsersModule } from 'src/users/users.module'
import { GameManagementGateway } from './game-management.gateway'
import { GameManagementService } from './game-management.service'

@Module({
  imports: [ UsersModule ],
  providers: [GameManagementGateway,
              GameManagementService,
              CheckersService],
  exports: [ CheckersService ]
})
export class GameManagementModule {}
