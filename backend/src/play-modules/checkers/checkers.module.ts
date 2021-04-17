import { Module } from '@nestjs/common'
import { CheckersService } from './checkers.service'
import { CheckersGateway } from './checkers.gateway'

@Module({
  providers: [CheckersService, CheckersGateway]
})
export class CheckersModule {}
