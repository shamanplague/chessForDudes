import { User } from '../users/user'

export class Game {

  public static gameStatuses: any = {
    PREPARING: 'PREPARING',
    IN_PROGRESS: 'IN_PROGRESS',
    FINISHED: 'FINISHED'
  }

  public static gameTypes: any = {
    CHESS: 'CHESS',
    CHECKERS: 'CHECKERS'
  }

	 constructor(
    private id: number,
    private type: string,
    private status: string,
    private hoster: User,
    private players: Array<User>,
    private spectrators: Array<User>
  ) {}

  getId (): number {
    return this.id
  }
  getType (): string {
    return this.type
  }
  setType (type: string): void {
    if (!Game.gameTypes.hasOwnProperty(type)) {
      throw 'Недопустимый статус'
    } else {
      this.type = type
    }
  }
  getStatus (): string {
    return this.status
  }
  setStatus (status: string): void {
    if (!Game.gameStatuses.hasOwnProperty(status)) {
      throw 'Недопустимый статус'
    } else {
      this.status = status
    }
  }
  getHoster (): User {
    return this.hoster
  }
  addPlayer (user: User): void {
    this.players.push(user)
  }
	addSpectrator (user: User): void {
    this.spectrators.push(user)
  }
  deletePlayer (user: User): void {
    this.players = this.players.filter(item => item.getId() !== user.getId())
  }
	deleteSpectrator (user: User): void {
    this.spectrators = this.spectrators.filter(item => item.getId() !== user.getId())
  }
  getPlayers (): Array<User> {
    return this.players
  }
  getSpectrators (): Array<User> {
    return this.spectrators
  }
}
