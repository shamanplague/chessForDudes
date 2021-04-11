import { User } from '../users/user'

export class Game {
	nowPlaysUserId: number
	isOver: boolean = false
	// board: Board

  constructor(
    private id: number,
    private status: string,
    private hoster: User,
    private players: Array<User>,
    private spectrators: Array<User>
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
  addPlayer (user: User) {
    this.players.push(user)
  }
	addSpectrator (user: User) {
    this.spectrators.push(user)
  }
  getPlayers () {
    return this.players
  }
  getSpectrators () {
    return this.spectrators
  }

}
