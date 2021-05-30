import { CellCoordinate } from './cell.coordinate'
import { Checker } from './checker'
import { NullChecker } from './null.checker'

export class Cell {
  constructor (
    private checker: Checker,
    private coordinates: CellCoordinate,
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
  getCoordinates (): CellCoordinate {
    return this.coordinates
  }
}