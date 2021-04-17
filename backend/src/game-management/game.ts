import { User } from '../users/user'

export class Game {

  public static gameStatuses: any = {
    PREPARING: 'PREPARING',
    IN_PROGRESS: 'IN_PROGRESS',
    FINISHED: 'FINISHED'
  }

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
  setStatus (status) {
    if (!Game.gameStatuses.hasOwnProperty(status)) {
      throw 'Недопустимый статус'
    } else {
      this.setStatus(status)
    }
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
  deletePlayer (user: User) {
    this.players = this.players.filter(item => item.getId() !== user.getId())
  }
	deleteSpectrator (user: User) {
    this.spectrators = this.spectrators.filter(item => item.getId() !== user.getId())
  }
  getPlayers () {
    return this.players
  }
  getSpectrators () {
    return this.spectrators
  }

}
