export class User {

  constructor (
    private id: number,
    private username: string,
    private password: string,
    private token: string,
    private socketId: string,
    private anonymous: boolean,
  ) {}

  getId () {
    return this.id
  }
  getUsername () : string {
    return this.username
  }
  getToken () : string {
    return this.token
  }
  setToken (token: string) : void {
    this.token = token
  }
  getSocketId (): string {
    return this.socketId
  }
  setSocketId (id: string): void {
    this.socketId = id
  }
  getPassword (): string {
    return this.password
  }
  isAnonymous (): boolean {
    return this.anonymous
  }
}
