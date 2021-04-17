import { Game } from "src/game-management/game";

export class CheckersGame extends Game {
  nowPlaysUserId: number
	isOver: boolean = false
	// board: Board
}
