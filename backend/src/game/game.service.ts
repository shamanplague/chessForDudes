import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { Game } from './game'

@Injectable()
export class GameService {
  constructor (
    private UsersService: UsersService
  ) {}

  private games: Array<Game> = [
    
  ]

  private gameStatuses = {
    PREPARING: 'PREPARING',
    IN_PROGRESS: 'IN_PROGRESS',
    FINISHED: 'FINISHED'
  }

  async findById(id: number): Promise<Game> {
    return this.games.find(item => item.getId() === id)
  }

  async createGame (hosterToken: string): Promise<Game> {

    let hoster = await this.UsersService.findByToken(hosterToken)

    console.log('Хуёстер', hoster)

    let game = new Game(
      this.nextGameIdGenerator.next().value,
      this.gameStatuses.PREPARING,
      hoster,
      [hoster],
      []
    )
    this.games.push(game)

    return game
  }
    
  private nextGameIdGenerator = function* gen() {
    let i = 0
    while (true) {
        yield i++
    }   
    }()

  // startGame () : Game {
  //   return this
  // }
      
  joinGame (): Boolean { //// { game_id: number }
    return true
  }

  getGamesCreatedByUser (userToken: string): Array<Number> {
    console.log('userToken', userToken)
    return this.games
    .filter(item => item.getHoster().getToken() === userToken)
    .map(item => item.getId())
  }

  getGameListForSending (userToken : string): Array<Object> {
    return this.games.map(item => this.getGameForSending(item))
  }

  getGameForSending (game: Game): Object {

    console.log('game', game)

   let hoster = game.getHoster().isAnonymous() ?
    'anonymous'
    :
    game.getHoster().getUsername()

    return {
      id: game.getId(),
      status: game.getStatus(),
      hoster
    }

  }
}
