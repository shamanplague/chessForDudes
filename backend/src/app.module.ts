import { Module } from '@nestjs/common'
import { GameManagementModule } from './game-management/game-management.module'
import { CheckersModule } from './play-modules/checkers/checkers.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [GameManagementModule, UsersModule, CheckersModule]
})
export class AppModule {}
