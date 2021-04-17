import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/websockets/constants'
import { UsersGateway } from './users.gateway'
import { UsersService } from './users.service'

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1000s' },
    })
  ],
  providers: [UsersService, UsersGateway],
  exports: [ UsersService, JwtModule]
})
export class UsersModule {}
