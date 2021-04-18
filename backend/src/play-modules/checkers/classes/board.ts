import { Cell } from "./cell";
import { CellCoordinates } from "./cell.coordinates";
import { Checker } from "./checker";
import { NullChecker } from "./null.checker";

export class Board {
  private cells: Array<Cell> = [
    new Cell(new NullChecker, new CellCoordinates('a', 1)),
    new Cell(new NullChecker, new CellCoordinates('c', 1)),
    new Cell(new NullChecker, new CellCoordinates('e', 1)),
    new Cell(new NullChecker, new CellCoordinates('g', 1)),

    new Cell(new NullChecker, new CellCoordinates('b', 2)),
    new Cell(new NullChecker, new CellCoordinates('d', 2)),
    new Cell(new NullChecker, new CellCoordinates('f', 2)),
    new Cell(new NullChecker, new CellCoordinates('h', 2)),

    new Cell(new NullChecker, new CellCoordinates('a', 3)),
    new Cell(new NullChecker, new CellCoordinates('c', 3)),
    new Cell(new NullChecker, new CellCoordinates('e', 3)),
    new Cell(new NullChecker, new CellCoordinates('g', 3)),

    new Cell(new NullChecker, new CellCoordinates('b', 4)),
    new Cell(new NullChecker, new CellCoordinates('d', 4)),
    new Cell(new NullChecker, new CellCoordinates('f', 4)),
    new Cell(new NullChecker, new CellCoordinates('h', 4)),
    
    new Cell(new NullChecker, new CellCoordinates('a', 5)),
    new Cell(new NullChecker, new CellCoordinates('c', 5)),
    new Cell(new NullChecker, new CellCoordinates('e', 5)),
    new Cell(new NullChecker, new CellCoordinates('g', 5)),

    new Cell(new NullChecker, new CellCoordinates('b', 6)),
    new Cell(new NullChecker, new CellCoordinates('d', 6)),
    new Cell(new NullChecker, new CellCoordinates('f', 6)),
    new Cell(new NullChecker, new CellCoordinates('h', 6)),
    
    new Cell(new NullChecker, new CellCoordinates('a', 7)),
    new Cell(new NullChecker, new CellCoordinates('c', 7)),
    new Cell(new NullChecker, new CellCoordinates('e', 7)),
    new Cell(new NullChecker, new CellCoordinates('g', 7)),
    
    new Cell(new NullChecker, new CellCoordinates('b', 8)),
    new Cell(new NullChecker, new CellCoordinates('d', 8)),
    new Cell(new NullChecker, new CellCoordinates('f', 8)),
    new Cell(new NullChecker, new CellCoordinates('h', 8)),
  ]

  setChecker(checker: Checker, coordinates: CellCoordinates): void {
    // console.log('Закидываем шашку', checker)
    this.getCellByCoordinates(coordinates).setChecker(checker)
  }
  getCellByCoordinates (coordinates: CellCoordinates): Cell {
    return this.cells.find(item => {
      let itemCoordinates = item.getCoordinates()
      return itemCoordinates.getLetter() === coordinates.getLetter()
      && itemCoordinates.getNumber() === coordinates.getNumber()
    })
  }
}