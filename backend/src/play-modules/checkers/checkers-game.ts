import { Game } from "src/game-management/game"
import { User } from "src/users/user"
import { Board } from "./classes/board"
import { CheckersPlayer } from "./classes/checkers-player"

export class CheckersGame extends Game {

	private board: Board
  private _isNowWhiteMove: boolean = true

	constructor (
    id: number,
    status: string,
    hoster: User,
    players: Array<CheckersPlayer>,
    spectrators: Array<User>
	){
    super(id, Game.gameTypes.CHECKERS, status, hoster, players, spectrators)
    this.board = new Board()
  }

  getBoard (): Board {
    return this.board
  }
  isNowWhiteMove () {
    return this._isNowWhiteMove
  }
  passMove (): void {
    this._isNowWhiteMove = !this._isNowWhiteMove
  }
}
