import { Injectable } from '@nestjs/common'
import { Game } from 'src/game-management/game'
import { CheckersGame } from './checkers-game'
import { CellCoordinate } from './classes/cell.coordinate'
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
  
  async loadBoardPreset (gameId: number, preset: {checker: Checker, coordinates: CellCoordinate}[]) {
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

    let fromCoordinate = new CellCoordinate(move.coordinates.from)
    let toCoordinate = new CellCoordinate(move.coordinates.to)

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
    let targetCell = game.getBoard().getCellByCoordinates(step.getTargetCell())
    if (!targetCell) {
      throw new WsException('Wrong cell for move')
    }
    targetCell.setChecker(checker)
    game.getBoard().getCellByCoordinates(step.getStartCell()).removeChecker()
  }

  async getAvailableMoves (
    user: User,
    gameId: number,
    coordinate: CellCoordinate
  ): Promise<Array<CellCoordinate>> {
    console.log('coordinate', coordinate)
    console.log('user', user)
    console.log('gameId', gameId)

    let board = this.games
    .find(item => item.getId() === gameId)
    .getBoard()

    let getNextChart = (letter: string) => {
      let nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1)
      return /^[a-h]$/.test(nextLetter) ? nextLetter : null
    }

    let getPrevChart = (letter: string) => {
      let nextLetter = String.fromCharCode(letter.charCodeAt(0) - 1)
      return /^[a-h]$/.test(nextLetter) ? nextLetter : null
    }

    let getNextNumber = (number: number) => {
      return number + 1 > 8 ? null : number + 1
    }

    let getPrevNumber = (number: number) => {
      return number - 1 < 1 ? null : number - 1
    }

    console.log('prev', getPrevChart(coordinate.getLetter()))
    console.log('next', getNextChart(coordinate.getLetter()))

    let availableCells: Array<CellCoordinate> = []

    let tryAddCell = (letter: string, number: number) => {
      let findedCell = board.getCellByCoordinates(
        new CellCoordinate(`${letter}${number}`)
      )
      if (!findedCell.hasChecker()) {
        availableCells.push(findedCell.getCoordinates())
      }
    }

    let checkersPlayer = (await this.findById(gameId))
    .getPlayers()
    .find(item => item.getId() === user.getId())

    //для простого хода
    let neededNumber = checkersPlayer
    .isCheckersColorWhite() ? 
      getNextNumber(coordinate.getNumber())
      :
      getPrevNumber(coordinate.getNumber())

    if (getPrevChart(coordinate.getLetter()) && neededNumber) {
      tryAddCell(getPrevChart(coordinate.getLetter()), neededNumber)
    }

    if (getNextChart(coordinate.getLetter()) && neededNumber) {
      tryAddCell(getNextChart(coordinate.getLetter()), neededNumber)
    }

    // переписать на функцию с аргументами направления
    // let tryMakeJump =  () => {

    // }

    //для прыжка
    //право верх
    let nearRightUpLetter = getNextChart(coordinate.getLetter())
    let rightUpLetter = getNextChart(nearRightUpLetter)
    let nearRightUpNumber = getNextNumber(coordinate.getNumber())
    let rightUpNumber = getNextNumber(nearRightUpNumber)
    // let isOpponentsChecker = board
    // .getCellByCoordinates(new CellCoordinate(`${nearRightUpLetter}${nearRightUpNumber}`))
    // .getChecker().isWhite() !== checkersPlayer.isCheckersColorWhite()
    // if (rightUpLetter && rightUpNumber && isOpponentsChecker) {
    if (rightUpLetter && rightUpNumber) {
      tryAddCell(rightUpLetter, rightUpNumber)
    }
    //право низ
    let nearRightDownLetter = getNextChart(coordinate.getLetter())
    let rightDownLetter = getNextChart(nearRightDownLetter)
    let nearRightDownNumber = getPrevNumber(coordinate.getNumber())
    let rightDownNumber = getPrevNumber(nearRightDownNumber)
    if (rightDownLetter && rightDownNumber) {
      tryAddCell(rightDownLetter, rightDownNumber)
    }
    //лево низ
    let nearleftDownLetter = getPrevChart(coordinate.getLetter())
    let leftDownLetter = getPrevChart(nearleftDownLetter)
    let nearLeftDownNumber = getPrevNumber(coordinate.getNumber())
    let leftDownNumber = getPrevNumber(nearLeftDownNumber)
    if (leftDownLetter && leftDownNumber) {
      tryAddCell(leftDownLetter, leftDownNumber)
    }
    //лево верх
    let nearLeftUpLetter = getPrevChart(coordinate.getLetter())
    let leftUpLetter = getPrevChart(nearLeftUpLetter)
    let nearLeftUpNumber = getNextNumber(coordinate.getNumber())
    let leftUpNumber = getNextNumber(nearLeftUpNumber)
    if (leftUpLetter && leftUpNumber) {
      tryAddCell(leftUpLetter, leftUpNumber)
    }
    // return [new CellCoordinate('h1')]
    return availableCells
  }
}
