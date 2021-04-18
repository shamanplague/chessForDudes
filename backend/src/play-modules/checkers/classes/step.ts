import { CellCoordinates } from "./cell.coordinates"

export class Step {
  constructor (
    private gameId: number,
	  private from: CellCoordinates,
	  private to: CellCoordinates
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