import { Module } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { Gateway } from './socket.provider'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { GameService } from 'src/game/game.service'

@Module({
  imports: [
    JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1000s' },
  })
  ],
  providers: [Gateway, UsersService, GameService],
  exports: [JwtModule, GameService]
})
export class GatewayModule {}