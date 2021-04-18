import { Cell } from "./cell";
import { CellCoordinates } from "./cell.coordinates";
import { Checker } from "./checker";

export class Board {
  private cells: Array<Cell>

  setChecker(checker: Checker, coordinates: CellCoordinates): void {
    // вызов метода сравнения объекту
    // this.cells.find(item => item.getCoordinates)
  }
}