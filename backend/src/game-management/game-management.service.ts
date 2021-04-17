import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { User } from 'src/users/user'
import { UsersService } from '../users/users.service'
import { Game } from './game'

@Injectable()
export class GameManagementService {
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

  startGame (user: User, gameId: number): void {
    console.log('user', user)
    console.log('gameId', gameId)
  }
      
  joinGame (user: User, gameId: number, asPlayer: boolean): void {
    
    let neededGame = this.games.find(item => item.getId() === gameId)

    if (neededGame.getHoster().getId() === user.getId()) {
      throw new WsException('You are hoster')
    } else {
      if (neededGame.getPlayers().includes(user)) {
        throw new WsException('You are already player')
      }
      if (neededGame.getSpectrators().includes(user)) {
        throw new WsException('You are already spectrator')
      }
      if (asPlayer) {
        neededGame.addPlayer(user)
      } else {
        neededGame.addSpectrator(user)
      }
    }
  }

  leaveGame (user: User, gameId: number, isPlayer: boolean): void {
    
    let neededGame = this.games.find(item => item.getId() === gameId)

    if (isPlayer) {
      if (!neededGame.getPlayers().includes(user)) {
        throw new WsException('You are not a player')
      } else {
        neededGame.deletePlayer(user)
      }
    } else {
      if (!neededGame.getSpectrators().includes(user)) {
        throw new WsException('You are not a spectrator')
      } else {
        neededGame.deleteSpectrator(user)
      }
    }
      
  }

  deleteGame(user: User, gameId: number): void {
    let neededGame = this.games.find(item => item.getId() === gameId)

    if (neededGame.getHoster().getId() !== user.getId()) {
      throw new WsException('You are not a hoster')
    } else {
      let index = this.games.indexOf(neededGame)
      if (index !== -1) {
        this.games.splice(index, 1)
      }
    }
  }

  getGamesCreatedByUser (userToken: string): Array<Number> {
    return this.games
    .filter(item => item.getHoster().getToken() === userToken)
    .map(item => item.getId())
  }

  getGamesJoinedByUser (userToken: string): Array<Number> {
    return this.games
    .filter(item => item.getPlayers().map(item => item.getToken()).includes(userToken))
    .map(item => item.getId())
  }

  getGamesSpectratedByUser (userToken: string): Array<Number> {
    return this.games
    .filter(item => item.getSpectrators().map(item => item.getToken()).includes(userToken))
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
    .map(item => {
      return item.isAnonymous() ? 'anonymous' : item.getUsername()
    })

    return {
      id: game.getId(),
      status: game.getStatus(),
      hoster,
      players,
      spectrators
    }
  }
}
