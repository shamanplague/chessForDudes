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
    console.log('Закинули игру', this.games)
    await this.loadBoardPreset(newGame.getId(), CheckersPreset)
    let gameForSend = await this.formatGameForSend(newGame.getId())
    return gameForSend
  }

  async findById(id: number): Promise<CheckersGame> {
    console.log('games', this.games)
    console.log('id', id)
    return this.games.find(item => +item.getId() === +id)
  }
  
  async loadBoardPreset (gameId: number, preset: {checker: Checker, coordinates: CellCoordinates}[]) {
    let game = await this.findById(gameId)
    preset.forEach(chunk => {
      game.getBoard().getCellByCoordinates(chunk.coordinates).setChecker(chunk.checker)
    })
  }

  async formatGameForSend (gameId: number): Promise<Object> {
    let object: any = {}

    // console.log('приехало gameId', gameId)

    let game = await this.findById(gameId)

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

  async makeMove (move: {gameId: number, coordinates: {from: string, to: string}}) {
    console.log('move', move)
    let fromLabel = move.coordinates.from.match(/[a-h]/)[0]
    let fromNumber = +move.coordinates.from.match(/[1-8]/)[0]
    let toLabel = move.coordinates.to.match(/[a-h]/)[0]
    let toNumber = +move.coordinates.to.match(/[1-8]/)[0]

    let fromCoordinate = new CellCoordinates(fromLabel, fromNumber)
    let toCoordinate = new CellCoordinates(toLabel, toNumber)

    let neededGame = await this.findById(move.gameId)

    this.moveChecker(neededGame, fromCoordinate, toCoordinate)

    

    // console.log('fromCoordinate', fromCoordinate)
    // console.log('toCoordinate', toCoordinate)
  }

  private async moveChecker (game: CheckersGame, fromCoordinate: CellCoordinates, toCoordinate: CellCoordinates) {
    let checker = game.getBoard().getCellByCoordinates(fromCoordinate).getChecker()
    game.getBoard().getCellByCoordinates(toCoordinate).setChecker(checker)
    game.getBoard().getCellByCoordinates(fromCoordinate).removeChecker()
  }
}
