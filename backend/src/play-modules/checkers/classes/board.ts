import { Cell } from "./cell";
import { CellCoordinate } from "./cell.coordinate";
import { Checker } from "./checker";
import { NullChecker } from "./null.checker";

export class Board {
  private cells: Array<Cell> = [
    new Cell(new NullChecker, new CellCoordinate('a1')),
    new Cell(new NullChecker, new CellCoordinate('c1')),
    new Cell(new NullChecker, new CellCoordinate('e1')),
    new Cell(new NullChecker, new CellCoordinate('g1')),

    new Cell(new NullChecker, new CellCoordinate('b2')),
    new Cell(new NullChecker, new CellCoordinate('d2')),
    new Cell(new NullChecker, new CellCoordinate('f2')),
    new Cell(new NullChecker, new CellCoordinate('h2')),

    new Cell(new NullChecker, new CellCoordinate('a3')),
    new Cell(new NullChecker, new CellCoordinate('c3')),
    new Cell(new NullChecker, new CellCoordinate('e3')),
    new Cell(new NullChecker, new CellCoordinate('g3')),

    new Cell(new NullChecker, new CellCoordinate('b4')),
    new Cell(new NullChecker, new CellCoordinate('d4')),
    new Cell(new NullChecker, new CellCoordinate('f4')),
    new Cell(new NullChecker, new CellCoordinate('h4')),
    
    new Cell(new NullChecker, new CellCoordinate('a5')),
    new Cell(new NullChecker, new CellCoordinate('c5')),
    new Cell(new NullChecker, new CellCoordinate('e5')),
    new Cell(new NullChecker, new CellCoordinate('g5')),

    new Cell(new NullChecker, new CellCoordinate('b6')),
    new Cell(new NullChecker, new CellCoordinate('d6')),
    new Cell(new NullChecker, new CellCoordinate('f6')),
    new Cell(new NullChecker, new CellCoordinate('h6')),
    
    new Cell(new NullChecker, new CellCoordinate('a7')),
    new Cell(new NullChecker, new CellCoordinate('c7')),
    new Cell(new NullChecker, new CellCoordinate('e7')),
    new Cell(new NullChecker, new CellCoordinate('g7')),
    
    new Cell(new NullChecker, new CellCoordinate('b8')),
    new Cell(new NullChecker, new CellCoordinate('d8')),
    new Cell(new NullChecker, new CellCoordinate('f8')),
    new Cell(new NullChecker, new CellCoordinate('h8')),
  ]

  getCells (): Array<Cell> {
    return this.cells
  }
  setChecker(checker: Checker, coordinates: CellCoordinate): void {
    // console.log('Закидываем шашку', checker)
    this.getCellByCoordinates(coordinates).setChecker(checker)
  }
  getCellByCoordinates (coordinates: CellCoordinate): Cell {
    return this.cells.find(item => {
      let itemCoordinates = item.getCoordinates()
      return itemCoordinates.getLetter() === coordinates.getLetter()
      && itemCoordinates.getNumber() === coordinates.getNumber()
    })
  }
}