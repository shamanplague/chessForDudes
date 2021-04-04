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
    signOptions: { expiresIn: '60s' },
  })
  ],
  providers: [Gateway, UsersService, GameService, UsersService],
  exports: [JwtModule]
})
export class GatewayModule {}