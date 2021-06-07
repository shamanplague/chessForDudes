import { Game } from "src/game-management/game"
import { User } from "src/users/user"
import { Board } from "./classes/board"
import { CellCoordinate } from "./classes/cell.coordinate"
import { CheckersPlayer } from "./classes/checkers-player"
import { Step } from "./classes/step"

export class CheckersGame extends Game {

	private board: Board
  private _isNowWhiteMove: boolean = true
  private checkersPlayers: Array<CheckersPlayer>
  private longMove: {
    inProgress: boolean
    startCell: CellCoordinate
    moves: Array<Step>
    checkersForTaking: Array<CellCoordinate>
  } = {
    inProgress: false,
    startCell: null,
    moves: [],
    checkersForTaking: []
  }
  

	constructor (
    id: number,
    status: string,
    hoster: User,
    players: Array<CheckersPlayer>,
    spectrators: Array<User>
	){
    super(id, Game.gameTypes.CHECKERS, status, hoster, players, spectrators)
    this.board = new Board()
    this.checkersPlayers = players
  }

  getBoard (): Board {
    return this.board
  }
  getPlayers (): Array<CheckersPlayer> {
    return this.checkersPlayers
  }
  getCheckersPlayerById (id: number) {
    return this.checkersPlayers.find(item => item.getId() === id)
  }
  isNowWhiteMove () {
    return this._isNowWhiteMove
  }
  passMove (): void {
    this._isNowWhiteMove = !this._isNowWhiteMove
  }
  startLongMove (step: Step):void {
    this.longMove.inProgress = true
    this.longMove.startCell = step.getStartCell()
  }
  finishLongMove ():void {
    this.longMove.inProgress = false
    this.longMove.startCell = null
    this.longMove.checkersForTaking = []
    this.longMove.moves = []
  }
  isLongMoveNow (): boolean {
    return this.longMove.inProgress
  }
  addStepToLongMove (step: Step): void {
    this.longMove.moves.push(step)
  }
  addCheckerForTakeToLongMove (cellCoordinate: CellCoordinate): void {
    this.longMove.checkersForTaking.push(cellCoordinate)
  }
  getLongMoveStartCellCoordinate (): CellCoordinate {
    return this.longMove.startCell
  }
  getLongMoveSteps (): Array<Step> {
    return this.longMove.moves
  }
  getLongMoveCheckersForTaking (): Array<CellCoordinate> {
    return this.longMove.checkersForTaking
  }
}
