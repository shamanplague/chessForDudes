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
import { Cell } from './classes/cell'
import * as _ from 'lodash'
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
      let neededCell = game.getBoard().getCellByCoordinates(chunk.coordinates)
      if (neededCell) {
        neededCell.setChecker(chunk.checker) 
      } else {
        throw 'Недопустимая клетка для размещения'
      }
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

      let getArrayOfJumpedCells = (step: Step): Array<Cell> => {
        let goUp = step.getStartCell().getNumber() < step.getTargetCell().getNumber()
        let goRight = step.getStartCell().getLetter().charAt(0) < step.getTargetCell().getLetter().charAt(0)

        let numberFunc = goUp ? this.getNextNumber : this.getPrevNumber
        let charFunc = goRight ? this.getNextChar : this.getPrevChar

        let arrayOfCells: Array<Cell> = []

        let addNextCell = (coordinate: CellCoordinate): void => {
          let neededCellLetter = charFunc(coordinate.getLetter())
          let neededCellNumber = numberFunc(coordinate.getNumber())
          let nextCell = game
          .getBoard()
          .getCellByCoordinates(new CellCoordinate(
            `${neededCellLetter}${neededCellNumber}`
          ))

          arrayOfCells.push(nextCell)
          
          if (numberFunc(neededCellNumber) !== step.getTargetCell().getNumber()) {
            addNextCell(nextCell.getCoordinates())
          }
        }

        addNextCell(step.getStartCell())

        return arrayOfCells
      }

      let checkersForTaking = getArrayOfJumpedCells(step)
      .filter(item => item.hasChecker())

      checkersForTaking.forEach(item => {
        this.takeFigure(game, item.getCoordinates())
      })

      if (!checkersForTaking.length) {
        game.passMove()
      }

    } else {
      game.passMove()
    }

    let currentChecker = game
    .getBoard()
    .getCellByCoordinates(step.getTargetCell())
    .getChecker()

    let isCheckerBecameKing = 
    (player.isCheckersColorWhite() && step.getTargetCell().getNumber() === Board.getMaxNumber())
    || (!player.isCheckersColorWhite() && step.getTargetCell().getNumber() === Board.getMinNumber())

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

  private getNextChar = (letter: string) => {
    let nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1)
    return /^[a-h]$/.test(nextLetter) ? nextLetter : null
  }

  private getPrevChar = (letter: string) => {
    let nextLetter = String.fromCharCode(letter.charCodeAt(0) - 1)
    return /^[a-h]$/.test(nextLetter) ? nextLetter : null
  }

  private getNextNumber = (number: number) => {
    return number + 1 > Board.getMaxNumber() ? null : number + 1
  }

  private getPrevNumber = (number: number) => {
    return number - 1 < Board.getMinNumber() ? null : number - 1
  }

  getAvailableMoves (
    game: CheckersGame,
    coordinate: CellCoordinate
  ): Array<CellCoordinate> {

    let availableCells: Array<Array<CellCoordinate>> = []

    let currentChecker = game.getBoard().getCellByCoordinates(coordinate).getChecker()

    let tryAddCells = (isHorizontalRight: boolean, isVerticalUp: boolean): void => {

      let availableMovesForDirection: Array<CellCoordinate> = []
      let foundCellsWithCheckers: Array<Cell> = []
      let numberOfIteration: number = 0
      let isMoveBack: boolean = currentChecker.isWhite() ? !isVerticalUp : isVerticalUp

      let maxAvailableStepsReached = (cell: CellCoordinate) => {
        let maxLetter = isVerticalUp ? Board.getMaxLetter() : Board.getMinLetter()
        let maxNumber = isVerticalUp ? Board.getMaxNumber() : Board.getMinNumber()
      
        if (currentChecker.isKing()) {
          return cell.getNumber() === maxNumber || cell.getLetter() === maxLetter
        } else {
          return numberOfIteration === 2
        }
      }
      
      let numberFunc = isVerticalUp ? this.getNextNumber : this.getPrevNumber
      let charFunc = isHorizontalRight ? this.getNextChar : this.getPrevChar

      let addNextCell = (cell: CellCoordinate) => {
        let nextCellLetter = charFunc(cell.getLetter())
        let nextCellNumber = numberFunc(cell.getNumber())

        if (!nextCellLetter || !nextCellNumber) return

        let foundCell = game.getBoard().getCellByCoordinates(
          new CellCoordinate(`${nextCellLetter}${nextCellNumber}`)
        )

        numberOfIteration++
        let continueCounting: boolean = true

        if (!foundCell.hasChecker()) {
          let isJump = Math.abs(coordinate.getNumber() - foundCell.getCoordinates().getNumber()) > 1
          let validMoveBack = !isMoveBack || (isMoveBack && isJump)
          if (currentChecker.isKing() || (!currentChecker.isKing() && validMoveBack)) {
            availableMovesForDirection.push(foundCell.getCoordinates())
          }

          if (!currentChecker.isKing()) {
            continueCounting = false
          }
        } else {
          
          if (currentChecker.isKing()) {
            if (foundCellsWithCheckers.length) {
              let isNearCell = 
              Math.abs(
                foundCellsWithCheckers[0].getCoordinates().getNumber() - foundCell.getCoordinates().getNumber()
              ) === 1

              if (isNearCell) {
                continueCounting = false
              } else {
                availableMovesForDirection.push(foundCell.getCoordinates())
                foundCellsWithCheckers.unshift(foundCell)
              }
            } else {
              let isMyChecker = foundCell.getChecker().isWhite() === currentChecker.isWhite()

              if (isMyChecker) {
                continueCounting = false
              } else {
                availableMovesForDirection.push(foundCell.getCoordinates())
                foundCellsWithCheckers.unshift(foundCell)
              }
            }
          } else {
            if (foundCellsWithCheckers.length) {
              let nearCell = Math.abs(
                foundCellsWithCheckers[0].getCoordinates().getNumber() - foundCell.getCoordinates().getNumber()
              ) === 1
              if (nearCell) {
                availableMovesForDirection = []
              }
            } else {
              if (foundCell.getChecker().isWhite() === currentChecker.isWhite()) {
                continueCounting = false
              } else {
                availableMovesForDirection.push(foundCell.getCoordinates())
                foundCellsWithCheckers.unshift(foundCell)
              }
            }
          }
        }

        let maxReached = maxAvailableStepsReached(foundCell.getCoordinates())

        if (!maxReached && continueCounting) {
          addNextCell(foundCell.getCoordinates())
        }

      }

      addNextCell(coordinate)

      availableCells.push(availableMovesForDirection)

    }

    tryAddCells(true, true)
    tryAddCells(true, false)
    tryAddCells(false, false)
    tryAddCells(false, true)

    // let movesWithTakes = []
    let movesWithTakes = availableCells.filter(cellCoordinatesChunk => {
      return cellCoordinatesChunk.some(cell => {
        let checker = game.getBoard().getCellByCoordinates(cell).getChecker()
        return !checker.isNull() 
        && checker.isWhite() !== currentChecker.isWhite()
        && cellCoordinatesChunk.indexOf(cell) !== cellCoordinatesChunk.length - 1
      })
    })

    let resultArray = movesWithTakes.length ? movesWithTakes : availableCells

    let filteredresultArray = resultArray.map(chunk => 
        chunk.filter(cell =>
        game.getBoard().getCellByCoordinates(cell).getChecker().isNull()
        // true
      )
    )

    return _.flattenDeep(filteredresultArray)
  }

  private takeFigure (game: CheckersGame, coordinate: CellCoordinate) {//todo смотреть сколько было убито
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
