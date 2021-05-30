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
  getStartCell (): any {
    return this.from
  }
  getTargetCell (): any {
    return this.to
  }

}