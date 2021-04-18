import { Game } from "src/game-management/game";
import { User } from "src/users/user";
import { Board } from "./classes/board";

export class CheckersGame extends Game {

	private board: Board
  // nowPlaysUserId: number

	constructor (
    id: number,
    status: string,
    hoster: User,
    players: Array<User>,
    spectrators: Array<User>,
	){
    super(id, status, hoster, players, spectrators)
    this.board = new Board()
  }

  getBoard () {
    return this.board
  }
}
