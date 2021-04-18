import { Injectable } from '@nestjs/common'
import { Game } from 'src/game-management/game'
import { CheckersGame } from './checkers-game'
import { CellCoordinates } from './classes/cell.coordinates'
import { Checker } from './classes/checker'
import Preset from 'src/play-modules/checkers/classes/preset'

@Injectable()
export class CheckersService {
  private games: Array<CheckersGame> = [
    
  ]

  async startGame (game: Game): Promise<void> {
    let newGame = new CheckersGame(
      game.getId(),
      Game.gameStatuses.IN_PROGRESS,
      game.getHoster(),
      game.getPlayers(),
      game.getSpectrators()
    )

    this.games.push(newGame)
    await this.loadBoardPreset(newGame.getId(), Preset)
    // console.log('Закидываем игру в активные')

    // console.log('палим стейт доски', newGame.getBoard())
  }

  async findById(id: number): Promise<CheckersGame> {
    return this.games.find(item => item.getId() === id)
  }
  
  async loadBoardPreset (gameId: number, preset : Array<any>) {
    let game = await this.findById(gameId)
    preset.forEach(chunk => {
      game.getBoard().getCellByCoordinates(chunk.coordinates).setChecker(chunk.checker)
    })
  } 
}
