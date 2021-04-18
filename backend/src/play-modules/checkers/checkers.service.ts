import { Injectable } from '@nestjs/common'
import { Game } from 'src/game-management/game'
import { CheckersGame } from './checkers-game'
import { CellCoordinates } from './classes/cell.coordinates'
import { Checker } from './classes/checker'
import CheckersPreset from 'src/play-modules/checkers/classes/data/checkers.preset'

@Injectable()
export class CheckersService {
  private games: Array<CheckersGame> = [
    
  ]

  async startGame (game: Game): Promise<CheckersGame> {
    let newGame = new CheckersGame(
      game.getId(),
      Game.gameStatuses.IN_PROGRESS,
      game.getHoster(),
      game.getPlayers(),
      game.getSpectrators()
    )

    this.games.push(newGame)
    await this.loadBoardPreset(newGame.getId(), CheckersPreset)
    // console.log('Закидываем игру в активные')

    // console.log('палим стейт доски', newGame.getBoard())
    return this.findById(newGame.getId())
  }

  async findById(id: number): Promise<CheckersGame> {
    return this.games.find(item => item.getId() === id)
  }
  
  async loadBoardPreset (gameId: number, preset: {checker: Checker, coordinates: CellCoordinates}[]) {
    let game = await this.findById(gameId)
    preset.forEach(chunk => {
      game.getBoard().getCellByCoordinates(chunk.coordinates).setChecker(chunk.checker)
    })
  } 
}
