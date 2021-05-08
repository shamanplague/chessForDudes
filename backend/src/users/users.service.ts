import { Injectable } from '@nestjs/common'
import { User } from './user'


@Injectable()
export class UsersService {
  constructor () {
    this.loadUsers()
  }
  private users: Array<User> = [
    
  ]

  private nextUserIdGenerator = function* gen() {
    let i = 1
    while (true) {
       yield i++
    }   
   }()

  private loadUsers () {
    this.users.push(...[
      new User (
        this.nextUserIdGenerator.next().value,
        'john',
        'john',
        '',
        '',
        false
      ),
      new User (
        this.nextUserIdGenerator.next().value,
        'garfield',
        'garfield',
        '',
        '',
        false
      ),
      new User (
        this.nextUserIdGenerator.next().value,
        'liz',
        'liz',
        '',
        '',
        false
      ),
      new User (
        this.nextUserIdGenerator.next().value,
        'odie',
        'odie',
        '',
        '',
        false
      ),
      new User (
        this.nextUserIdGenerator.next().value,
        'anonymous',
        'anonymous',
        '',
        '',
        true
      )
    ])
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.getUsername() === username)
  }

  async findByToken(token: string): Promise<User | undefined> {
    // console.log('this.users', this.users)
    // console.log('token', token)
    // console.log('finded user', this.users.find(user => user.getToken() === token))
    return this.users.find(user => user.getToken() === token)
  }

  async assignToken(username: string, token: string): Promise<User> {
    let user = await this.findOne(username)
    user.setToken(token)
    return user
  }

  // async addUser(username : string, token : any) {
  //   let userData = await this.findOne(username)
  //   this.users.push(new User(
  //     this.nextUserIdGenerator.next().value,
  //     userData.getUsername(),
  //     userData.getPassword(),
  //     token.access_token,
  //     false
  //   ))
  // }

  async addAnonymousUser(): Promise<User | undefined> {

    let nextIndex = this.nextUserIdGenerator.next().value

    let newAnonymousUser = new User (
      nextIndex,
      'temp_user_' + nextIndex,
      'anonymous',
      '',
      '',
      true
    )

    this.users.push(newAnonymousUser)
    
    return newAnonymousUser
  }
}