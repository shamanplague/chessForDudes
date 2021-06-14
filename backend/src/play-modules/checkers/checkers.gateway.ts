import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import ServerEvents from 'src/websockets/server.events'
import ClientsEvents from 'src/websockets/client.events'
import { UserToken } from 'src/decorators/user-token.decorator'
import { UsersService } from 'src/users/users.service'
import { CheckersService } from 'src/play-modules/checkers/checkers.service'
import { CellCoordinate } from './classes/cell.coordinate'
import { Step } from './classes/step'
import { Board } from './classes/board'

@WebSocketGateway()
export class CheckersGateway {
  @WebSocketServer() 
  private server: Server

  constructor (
    private UsersService : UsersService,
    private CheckersService : CheckersService
  ) {}

  @SubscribeMessage(ServerEvents.GET_ACTIVE_CHECKERS_GAMES)
  async handleGetActiveGames(
    @ConnectedSocket() client: Socket,
    @UserToken() userToken: string
  ): Promise<void> {
    let user = await this.UsersService.findByToken(userToken)
    let games = this.CheckersService
    .getAllActiveGamesForUser(user)
    .map(item => this.CheckersService.getFormattedGame(item))

    games.forEach(item => {
      this.server.sockets.sockets[user.getSocketId()].join(`${item.gameId}`)
    })

    client.emit(ClientsEvents.GET_ACTIVE_CHECKERS_GAMES, {
      games
    })
  }

  @SubscribeMessage(ServerEvents.DEFINE_COLOR)
  async handleDefineColor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: number},//todo сделать так везде
    @UserToken() userToken: string
  ): Promise<void> {
    let usersColorIsWhite = await this.CheckersService.defineColor(userToken, payload.gameId)
    client.emit(ClientsEvents.DEFINE_COLOR, { gameId: payload.gameId, usersColorIsWhite })
  }
  
  @SubscribeMessage(ServerEvents.MAKE_MOVE)
  async handleMakeMove(
    @MessageBody() payload: { gameId: number, coordinates: { from: string, to: string } },
    @UserToken() userToken: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {

    let fromCoordinate = new CellCoordinate(payload.coordinates.from)
    let toCoordinate = new CellCoordinate(payload.coordinates.to)

    let step = new Step(payload.gameId, fromCoordinate, toCoordinate)
    let game = await this.CheckersService.findGameById(payload.gameId)
    let user = await this.UsersService.findByToken(userToken)
    let player = game.getPlayers().find(item => item.getId() === user.getId())
    let currentChecker = game.isLongMoveNow() ?
    game.getBoard().getCellByCoordinates(
      game.getLongMoveStartCellCoordinate()
    ).getChecker()
    :
    game.getBoard().getCellByCoordinates(step.getStartCell()).getChecker()

    await this.CheckersService.validateMove(currentChecker, game, player, step)

    let checkerForTake = this.CheckersService
    .getArrayOfJumpedCells(game, step)
    .find(item => item.hasChecker())

    // console.log('checkerForTake', checkerForTake)

    if (game.isLongMoveNow()) {
      game.addStepToLongMove(step)
    }

    let isCheckerBecameKing =
    (player.isCheckersColorWhite() && step.getTargetCell().getNumber() === Board.getMaxNumber())
    || (!player.isCheckersColorWhite() && step.getTargetCell().getNumber() === Board.getMinNumber())

    if (isCheckerBecameKing && !currentChecker.isKing()) {
      currentChecker.makeKing()
    }

    if (checkerForTake && this.CheckersService.hasNeedToTakeFigure(currentChecker, checkerForTake.getCoordinates(), game, step)) {
      if (!game.isLongMoveNow()) {
        game.startLongMove(step)
        game.addStepToLongMove(step)
      }

      game.addCheckerForTakeToLongMove(checkerForTake.getCoordinates())

      let availableMoves = this.CheckersService
      .getAvailableMoves(currentChecker, game, step.getTargetCell())

      client.emit(ClientsEvents.GET_AVAILABLE_MOVES, {
        moves: availableMoves.map(item => item.asString())
      })

    } else {
      if (game.isLongMoveNow()) {
        game.getLongMoveSteps().forEach(async step => {
          this.CheckersService.makeMove(game, step)
          
          this.server.to(`${payload.gameId}`).emit(ClientsEvents.GET_ACTUAL_GAME_STATE,
            { game: this.CheckersService.getFormattedGame(game) }
          )
          // todo корректно реализовать задержку
        })
  
        game.finishLongMove()
        game.passMove()
      } else {
        this.CheckersService.makeMove(game, step)
  
        game.passMove()
      }

      this.server.to(`${payload.gameId}`).emit(ClientsEvents.GET_ACTUAL_GAME_STATE,
        { game: this.CheckersService.getFormattedGame(game) }
      )
    }

    // client.emit(ClientsEvents.NOTIFICATION_FROM_SERVER, { message: `Бей ещё` })

    client.emit(ClientsEvents.GET_ACTUAL_GAME_STATE,
      { game: this.CheckersService.getFormattedGame(game) }
    )

    let winner = this.CheckersService.defineWinner(game)

    if (winner) {
      this.server.to(`${payload.gameId}`).emit(ClientsEvents.NOTIFICATION_FROM_SERVER, { message: `Победитель ${winner.getUsername()}` })
    }
  }

  @SubscribeMessage(ServerEvents.GET_AVAILABLE_MOVES)
  async handleGetAvailableMoves(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: number, coordinate: string },
    @UserToken() userToken: string
  ): Promise<void> {
    let coordinates = new CellCoordinate(payload.coordinate)

    let game = await this.CheckersService.findGameById(payload.gameId)
    
    let availableMoves = this.CheckersService
    .getAvailableMoves(
      game.getBoard().getCellByCoordinates(coordinates).getChecker(),
      game,
      coordinates
    )

    client.emit(ClientsEvents.GET_AVAILABLE_MOVES, {
      moves: availableMoves.map(item => item.asString())
    })
  }
}
