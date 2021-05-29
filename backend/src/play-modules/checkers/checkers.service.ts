import { Injectable } from '@nestjs/common'
import { Game } from 'src/game-management/game'
import { CheckersGame } from './checkers-game'
import { CellCoordinates } from './classes/cell.coordinates'
import { Checker } from './classes/checker'
import CheckersPreset from 'src/play-modules/checkers/classes/data/checkers.preset'
import { CheckersPlayer } from './classes/checkers-player'
import { Step } from './classes/step'
import { WsException } from '@nestjs/websockets'
import { UsersService } from 'src/users/users.service'
import { GameManagementService } from 'src/game-management/game-management.service'
import { User } from 'src/users/user'
import { Board } from './classes/board'

@Injectable()
export class CheckersService {
  private games: Array<CheckersGame> = [
    
  ]

  constructor (
    // private GameManagementService: GameManagementService,
    private UsersService: UsersService
  ){}

  async startGame (user: User, game: Game): Promise<CheckersGame> {
    
    // let game = await this.GameManagementService.findById(gameId)
    // let game = await this.findById(gameId)
    let newCheckersPlayers = game.getPlayers().map(item => {
      return new CheckersPlayer(item, game.getHoster().getId() === item.getId())
    })

    // console.log('newCheckersPlayers', newCheckersPlayers)

    let newGame = new CheckersGame(
      game.getId(),
      Game.gameStatuses.IN_PROGRESS,
      game.getHoster(),
      newCheckersPlayers,
      game.getSpectrators()
    )

    this.games.push(newGame)
    await this.loadBoardPreset(newGame.getId(), CheckersPreset)
    // console.log('Стучится user', user)

    // console.log('Закинули игру', this.games)
    return newGame
  }

  async findById(id: number): Promise<CheckersGame> {
    // console.log('games', this.games)
    // console.log('id', id)
    return this.games.find(item => +item.getId() === +id)
  }
  
  async loadBoardPreset (gameId: number, preset: {checker: Checker, coordinates: CellCoordinates}[]) {
    let game = await this.findById(gameId)
    preset.forEach(chunk => {
      game.getBoard().getCellByCoordinates(chunk.coordinates).setChecker(chunk.checker)
    })
  }

  async defineColor (userToken: string, gameId: number): Promise<boolean> {
    let user = await this.UsersService.findByToken(userToken)
    let game = await this.findById(gameId)

    //проверить, не левый ли хуй стучится

    return game.getPlayers()
    .find(item => item.getId() === user.getId())
    .isCheckersColorWhite()
  }

  getAllActiveGamesForUser ( user: User ): Array<CheckersGame> {
    let res = this.games.filter(item => 
      item.getPlayers().some(item => item.getId() === user.getId())
      ||
      item.getSpectrators().some(item => item.getId() === user.getId())
    ) 
    // console.log('forUser', res)
    return res
  }

  getFormattedGame (game: CheckersGame): {
    gameId: number,
    players: Array<CheckersPlayer>,
    isNowWhiteMove: boolean,
    board: Board
  }{
    let object: any = {}

    // console.log('приехала game', game.getId())

    object.gameId = game.getId()
    object.players = game.getPlayers().map(item => {
      return {
        name: item.isAnonymous() ? 'anonymous' : item.getUsername(),
        color: item.isCheckersColorWhite() ? 'white' : 'black'
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

    // console.log('Скрутили игру', object)

    return object
  }

  async makeMove (userId: number, move: {gameId: number, coordinates: {from: string, to: string}}) {
    console.log('move', move)
    let fromLabel = move.coordinates.from.match(/[a-h]/)[0]
    let fromNumber = +move.coordinates.from.match(/[1-8]/)[0]
    let toLabel = move.coordinates.to.match(/[a-h]/)[0]
    let toNumber = +move.coordinates.to.match(/[1-8]/)[0]

    let fromCoordinate = new CellCoordinates(fromLabel, fromNumber)
    let toCoordinate = new CellCoordinates(toLabel, toNumber)

    let game = await this.findById(move.gameId)

    let player = game.getCheckersPlayerById(userId)

    let step = new Step(move.gameId, fromCoordinate, toCoordinate)

    let checker = game.getBoard().getCellByCoordinates(step.getStartCell()).getChecker()
    if (player.isCheckersColorWhite() !== game.isNowWhiteMove()) {
      throw new WsException('Is not your move')
    }

    if (player.isCheckersColorWhite() !== checker.isWhite() ) {
      throw new WsException('Is not your checker')
    }

    this.moveChecker(game, step)

    game.passMove()

    // console.log('fromCoordinate', fromCoordinate)
    // console.log('toCoordinate', toCoordinate)
  }

  private moveChecker (game: CheckersGame, step: Step): void {
    let checker = game.getBoard().getCellByCoordinates(step.getStartCell()).getChecker()
    game.getBoard().getCellByCoordinates(step.getTargetCell()).setChecker(checker)
    game.getBoard().getCellByCoordinates(step.getStartCell()).removeChecker()
  }
}
