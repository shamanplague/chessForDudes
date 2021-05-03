import { Injectable } from '@nestjs/common'
import { Game } from 'src/game-management/game'
import { CheckersGame } from './checkers-game'
import { CellCoordinates } from './classes/cell.coordinates'
import { Checker } from './classes/checker'
import CheckersPreset from 'src/play-modules/checkers/classes/data/checkers.preset'
import { CheckersPlayer } from './classes/checkers-player'

@Injectable()
export class CheckersService {
  private games: Array<CheckersGame> = [
    
  ]

  async startGame (game: Game): Promise<Object> {
    let newCheckersPlayers = game.getPlayers().map(item => {
      return new CheckersPlayer(item, game.getPlayers().indexOf(item) === 0)
    })

    console.log('newCheckersPlayers', newCheckersPlayers)

    let newGame = new CheckersGame(
      game.getId(),
      Game.gameStatuses.IN_PROGRESS,
      game.getHoster(),
      newCheckersPlayers,
      game.getSpectrators()
    )

    this.games.push(newGame)
    await this.loadBoardPreset(newGame.getId(), CheckersPreset)
    return this.formatGameForSend(await this.findById(newGame.getId()))
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

  formatGameForSend (game: CheckersGame): Object {
    let object: any = {}

    object.gameId = game.getId()
    object.players = game.getPlayers().map(item => {
      return {
        name: item.isAnonymous() ? 'anonymous' : item.getUsername(),
        color: item.getId() === game.getHoster().getId() ? 'white' : 'black'
      }
    })
    object.isNowWhiteMove = game.isNowWhiteMove()
    object.board = game.getBoard().getCells().map(item => {
      let res: any = {}
      res.coordinate = item.getCoordinates().getLetter() + item.getCoordinates().getNumber()
      if (item.hasChecker()) {
        res.checker = {}
        res.checker.isWhite = item.getChecker().isWhite()
        res.checker.isKing = item.getChecker().isKing()
      }

      return res
    })

    console.log('Скрутили игру', object)

    return object
  }
}
