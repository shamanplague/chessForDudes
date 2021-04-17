import { Module } from '@nestjs/common'
import { GameManagementModule } from './game-management/game-management.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    GameManagementModule, UsersModule]
})
export class AppModule {}
