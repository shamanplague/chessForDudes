import { User } from '../users/user'

export class Game {
	nowPlaysUserId: number
	isOver: boolean = false
	// board: Board

  constructor(
    private id: number,
    private status: string,
    private hoster: User,
    players: Array<User>,
    spectrators: Array<User>
  ) {}

  getId () {
    return this.id
  }
  getStatus () {
    return this.status
  }
  getHoster () {
    return this.hoster
  }
	
}
