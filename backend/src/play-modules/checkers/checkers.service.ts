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
import { User } from 'src/users/user'
import { Board } from './classes/board'

@Injectable()
export class CheckersService {
  private games: Array<CheckersGame> = [
    
  ]

  constructor (
    private UsersService: UsersService
  ){}

  async startGame (user: User, game: Game): Promise<CheckersGame> {

    let newCheckersPlayers = game.getPlayers().map(item => {
      return new CheckersPlayer(item, game.getHoster().getId() === item.getId())
    })

    let newGame = new CheckersGame(
      game.getId(),
      Game.gameStatuses.IN_PROGRESS,
      game.getHoster(),
      newCheckersPlayers,
      game.getSpectrators()
    )

    this.games.push(newGame)
    await this.loadBoardPreset(newGame.getId(), CheckersPreset)

    return newGame
  }

  async findGameById(id: number): Promise<CheckersGame> {
    return this.games.find(item => +item.getId() === +id)
  }
  
  async loadBoardPreset (gameId: number, preset: {checker: Checker, coordinates: CellCoordinate}[]) {
    let game = await this.findGameById(gameId)
    preset.forEach(chunk => {
      game.getBoard().getCellByCoordinates(chunk.coordinates).setChecker(chunk.checker)
    })
  }

  async defineColor (userToken: string, gameId: number): Promise<boolean> {
    let user = await this.UsersService.findByToken(userToken)
    let game = await this.findGameById(gameId)

    //todo проверить, не левый ли хуй стучится

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

    return res
  }

  getFormattedGame (game: CheckersGame): {
    gameId: number,
    players: Array<CheckersPlayer>,
    isNowWhiteMove: boolean,
    board: Board
  }{
    let object: any = {}//todo убрать any

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

    return object
  }

  async makeMove (userId: number, move: {gameId: number, coordinates: {from: string, to: string}}) {

    let fromCoordinate = new CellCoordinate(move.coordinates.from)
    let toCoordinate = new CellCoordinate(move.coordinates.to)

    let game = await this.findGameById(move.gameId)

    let player = game.getCheckersPlayerById(userId)

    let step = new Step(move.gameId, fromCoordinate, toCoordinate)

    await this.validateMove(game, player, step)

    this.moveChecker(game, step)

    if (step.isJump()) {
      let isMovingUp = 
      step.getStartCell().getNumber() < step.getTargetCell().getNumber()
      
      let isMovingRight =
      step.getStartCell().getLetter().charCodeAt(0) < step.getTargetCell().getLetter().charCodeAt(0)

      let neededCellNumber = isMovingUp ?
      step.getStartCell().getNumber() + 1
      :
      step.getStartCell().getNumber() - 1

      let neededCellLetter = isMovingRight ?
      String.fromCharCode(step.getStartCell().getLetter().charCodeAt(0) + 1)
      :
      String.fromCharCode(step.getStartCell().getLetter().charCodeAt(0) - 1)

      this.takeFigure(game, new CellCoordinate(`${neededCellLetter}${neededCellNumber}`))

    }

    let currentChecker = game
    .getBoard()
    .getCellByCoordinates(step.getTargetCell())
    .getChecker()

    let isCheckerBecameKing = 
    (player.isCheckersColorWhite()
    &&
    step.getTargetCell().getNumber() === game.getBoard().getMaxNumber())
    ||
    (!player.isCheckersColorWhite()
    &&
    step.getTargetCell().getNumber() === game.getBoard().getMinNumber())

    if (isCheckerBecameKing && !currentChecker.isKing()) {
      currentChecker.makeKing()
    }

  }

  private async validateMove ( game: CheckersGame, player: CheckersPlayer, step: Step ): Promise<void> {

    let checker = game.getBoard().getCellByCoordinates(step.getStartCell()).getChecker()
    
    if (player.isCheckersColorWhite() !== game.isNowWhiteMove()) {
      throw new WsException('Is not your move')
    }

    if (player.isCheckersColorWhite() !== checker.isWhite() ) {
      throw new WsException('Is not your checker')
    }

    let isAvailableMove = this.getAvailableMoves(
      game,
      step.getStartCell()
    )
    .map(item => item.asString())
    .includes(step.getTargetCell().asString())

    if (!isAvailableMove) {
      throw new WsException('Is not valid move')
    }
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

  getAvailableMoves (
    game: CheckersGame,
    coordinate: CellCoordinate
  ): Array<CellCoordinate> {

    let getNextChar = (letter: string) => {
      let nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1)
      return /^[a-h]$/.test(nextLetter) ? nextLetter : null
    }

    let getPrevChar = (letter: string) => {
      let nextLetter = String.fromCharCode(letter.charCodeAt(0) - 1)
      return /^[a-h]$/.test(nextLetter) ? nextLetter : null
    }

    let getNextNumber = (number: number) => {
      return number + 1 > game.getBoard().getMaxNumber() ? null : number + 1
    }

    let getPrevNumber = (number: number) => {
      return number - 1 < game.getBoard().getMinNumber() ? null : number - 1
    }

    let availableCells: Array<CellCoordinate> = []

    let tryAddCell = (letter: string, number: number) => {
      let findedCell = game.getBoard().getCellByCoordinates(
        new CellCoordinate(`${letter}${number}`)
      )
      if (!findedCell.hasChecker()) {
        availableCells.push(findedCell.getCoordinates())
      }
    }

    let currentChecker = game.getBoard().getCellByCoordinates(coordinate).getChecker()

    //для простого хода
    let neededNumber = currentChecker.isWhite() ? 
      getNextNumber(coordinate.getNumber())
      :
      getPrevNumber(coordinate.getNumber())

    if (getPrevChar(coordinate.getLetter()) && neededNumber) {
      tryAddCell(getPrevChar(coordinate.getLetter()), neededNumber)
    }

    if (getNextChar(coordinate.getLetter()) && neededNumber) {
      tryAddCell(getNextChar(coordinate.getLetter()), neededNumber)
    }

    let tryAddJump = (isHorizontalRight: boolean, isVerticalUp: boolean): void => {
      let numberFunc = isVerticalUp ? getNextNumber : getPrevNumber
      let charFunc = isHorizontalRight ? getNextChar : getPrevChar

      let nearLetter = charFunc(coordinate.getLetter())
      let letter = nearLetter ? charFunc(nearLetter) : null
      let nearNumber = numberFunc(coordinate.getNumber())
      let number = nearNumber ? numberFunc(nearNumber) : null

      if (!letter || !number) return

      let nearChecker = game
      .getBoard()
      .getCellByCoordinates(new CellCoordinate(`${nearLetter}${nearNumber}`))
      .getChecker()

      let isOpponentsChecker = (!nearChecker.isNull() &&
      nearChecker.isWhite() !== currentChecker.isWhite())
      if (letter && number && isOpponentsChecker) {
      // if (rightUpLetter && rightUpNumber) {
        tryAddCell(letter, number)
      }
    }

    tryAddJump(true, true)
    tryAddJump(true, false)
    tryAddJump(false, false)
    tryAddJump(false, true)

    return availableCells
  }

  private takeFigure (game: CheckersGame, coordinate: CellCoordinate) {
    game.getBoard().getCellByCoordinates(coordinate).removeChecker()
  }

  defineWinner (game: CheckersGame): CheckersPlayer {

    let winner: CheckersPlayer

    game.getPlayers().forEach(player => {
      let opponent = game.getPlayers().find(item => item.getId() !== player.getId())

      let cellsWithPlayersCheckers = game.getBoard()
      .getCells()
      .filter(item => 
        item.hasChecker() && item.getChecker().isWhite() === player.isCheckersColorWhite()
      )

      if (!cellsWithPlayersCheckers.length) {
        winner = opponent
      }

      let userHasMoves = false

      for (let cell of cellsWithPlayersCheckers) {
        if (this.getAvailableMoves(game, cell.getCoordinates()).length) {
          userHasMoves = true
          break
        }
      }

      if (!userHasMoves) {
        winner = opponent
      }

    })

    return winner
  }
}
