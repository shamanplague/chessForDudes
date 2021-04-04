import { Module } from '@nestjs/common'
import { GameService } from './game.service'
import { UsersService } from '../users/users.service'

@Module({
  providers: [GameService, UsersService],
  exports: [GameService, UsersService]
})
export class GameModule {}
