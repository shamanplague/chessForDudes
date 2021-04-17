import { Injectable } from '@nestjs/common'
import { Game } from 'src/game-management/game'
import { CheckersGame } from './checkers-game'

@Injectable()
export class CheckersService {
  private games: Array<CheckersGame> = [
    
  ]

  startGame (game: Game): void {
    let newGame = new CheckersGame(
      game.getId(),
      Game.gameStatuses.IN_PROGRESS,
      game.getHoster(),
      game.getPlayers(),
      game.getSpectrators()
    )

    this.games.push(newGame)
    console.log('Закидываем игру в активные')

    console.log('палим стейт сервиса', this.games)
  }
}
