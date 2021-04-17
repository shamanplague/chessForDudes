import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { GameManagementGateway } from './game-management.gateway'
import { GameManagementService } from './game-management.service'

@Module({
  imports: [ UsersModule ],
  providers: [GameManagementGateway, GameManagementService]
})
export class GameManagementModule {}
