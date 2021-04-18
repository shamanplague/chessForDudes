import { CellCoordinates } from './cell.coordinates'
import { Checker } from './checker'

export default (() => {
  return [
    {checker: new Checker(true), coordinates: new CellCoordinates('a', 1)},
    {checker: new Checker(true), coordinates: new CellCoordinates('c', 1)},
    {checker: new Checker(true), coordinates: new CellCoordinates('e', 1)},
    {checker: new Checker(true), coordinates: new CellCoordinates('g', 1)}
  ]
})()