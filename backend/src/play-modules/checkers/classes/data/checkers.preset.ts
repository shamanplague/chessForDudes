import { CellCoordinates } from '../cell.coordinates'
import { Checker } from '../checker'

export default (() => {
  return [
    {checker: new Checker(true), coordinates: new CellCoordinates('a', 1)},
    {checker: new Checker(true), coordinates: new CellCoordinates('c', 1)},
    {checker: new Checker(true), coordinates: new CellCoordinates('e', 1)},
    {checker: new Checker(true), coordinates: new CellCoordinates('g', 1)},

    {checker: new Checker(true), coordinates: new CellCoordinates('b', 2)},
    {checker: new Checker(true), coordinates: new CellCoordinates('d', 2)},
    {checker: new Checker(true), coordinates: new CellCoordinates('f', 2)},
    {checker: new Checker(true), coordinates: new CellCoordinates('h', 2)},

    {checker: new Checker(true), coordinates: new CellCoordinates('a', 3)},
    {checker: new Checker(true), coordinates: new CellCoordinates('c', 3)},
    {checker: new Checker(true), coordinates: new CellCoordinates('e', 3)},
    {checker: new Checker(true), coordinates: new CellCoordinates('g', 3)},

    {checker: new Checker(false), coordinates: new CellCoordinates('b', 6)},
    {checker: new Checker(false), coordinates: new CellCoordinates('d', 6)},
    {checker: new Checker(false), coordinates: new CellCoordinates('f', 6)},
    {checker: new Checker(false), coordinates: new CellCoordinates('h', 6)},
    
    {checker: new Checker(false), coordinates: new CellCoordinates('a', 7)},
    {checker: new Checker(false), coordinates: new CellCoordinates('c', 7)},
    {checker: new Checker(false), coordinates: new CellCoordinates('e', 7)},
    {checker: new Checker(false), coordinates: new CellCoordinates('g', 7)},
    
    {checker: new Checker(false), coordinates: new CellCoordinates('b', 8)},
    {checker: new Checker(false), coordinates: new CellCoordinates('d', 8)},
    {checker: new Checker(false), coordinates: new CellCoordinates('f', 8)},
    {checker: new Checker(false), coordinates: new CellCoordinates('h', 8)}
  ]
})()