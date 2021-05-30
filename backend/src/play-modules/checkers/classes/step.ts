import { CellCoordinate } from "./cell.coordinate"

export class Step {
  constructor (
    private gameId: number,
	  private from: CellCoordinate,
	  private to: CellCoordinate
  ) {}

  getGameId (): number {
    return this.gameId
  }
  getStartCell (): CellCoordinate {
    return this.from
  }
  getTargetCell (): CellCoordinate {
    return this.to
  }

  isJump (): boolean {
    return Math.abs(this.from.getNumber() - this.to.getNumber()) > 1
  }

}