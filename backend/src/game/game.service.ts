import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { User } from 'src/users/user'
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
      
  joinGame (user: User, gameId: number, asPlayer: boolean): Boolean { //// { game_id: number }
    console.log(`User ${user.getId()} want to join to game ${gameId}`)
    
    let neededGame = this.games.find(item => item.getId() === gameId)

    if (neededGame.getHoster().getId() === user.getId()) {
      throw new WsException('You are hoster')
    } else {
      if (asPlayer) {
        neededGame.addPlayer(user)
      } else {
        neededGame.addSpectrator(user)
      }

      // console.log('Добавили юзера в игру', neededGame)

      return true
    }
  }

  getGamesCreatedByUser (userToken: string): Array<Number> {
    return this.games
    .filter(item => item.getHoster().getToken() === userToken)
    .map(item => item.getId())
  }

  getGamesJoinedByUser (userToken: string): Array<Number> {
    return this.games
    .filter(item => item.getHoster().getToken() === userToken)
    .map(item => item.getId())
  }

  getGameListForSending (): Array<Object> {
    return this.games.map(item => this.getGameForSending(item))
  }

  getGameForSending (game: Game): Object {
   let hoster = game.getHoster().isAnonymous() ?
    'anonymous'
    :
    game.getHoster().getUsername()

    let players = game
    .getPlayers()
    .map(item => {
      return item.isAnonymous() ? 'anonymous' : item.getUsername()
    })

    let spectrators = game
    .getSpectrators()
    .map(item => item.getUsername())

    return {
      id: game.getId(),
      status: game.getStatus(),
      hoster,
      players,
      spectrators
    }

  }
}
