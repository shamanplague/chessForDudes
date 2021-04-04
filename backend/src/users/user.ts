export class User {

  constructor (
    private id: number,
    private username: string,
    private password: string,
    private token: string,
    private anonymous: boolean,
  ) {}

  getUsername () : string {
    return this.username
  }

  getToken () : string {
    return this.token
  }

  setToken (token: string) : void {
    this.token = token
  }

  getPassword (): string {
    return this.password
  }

  isAnonymous (): boolean {
    return this.anonymous
  }

}
