import { CellCoordinates } from './cell.coordinates'
import { Checker } from './checker'
import { NullChecker } from './null.checker'

export class Cell {
  constructor (
    private checker: Checker,
    private coordinates: CellCoordinates,
  ){}

  hasChecker (): boolean {
    return !this.checker.isNull()
  }
  getChecker (): Checker {
    return this.checker
  }
  setChecker (checker: Checker): void {
    if (this.hasChecker()) {
      throw 'Клетка занята'
    } else {
      this.checker = checker
    }
  }
  removeChecker () {
    this.checker = new NullChecker()
  }
  getCoordinates (): CellCoordinates {
    return this.coordinates
  }
}