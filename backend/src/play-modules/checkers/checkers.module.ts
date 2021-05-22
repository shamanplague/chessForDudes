import { Module } from '@nestjs/common'
import { CheckersService } from './checkers.service'
import { CheckersGateway } from './checkers.gateway'

@Module({
  imports: [],
  providers: [ CheckersGateway, CheckersService ],
  exports: [ CheckersService ]
})
export class CheckersModule {}
