import { CellCoordinate } from '../cell.coordinate'
import { Checker } from '../checker'

export default (() => {
  return [
    //для колянов
    // {checker: new Checker(true), coordinates: new CellCoordinate('h8')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('f6')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('d4')},
    // {checker: new Checker(true), coordinates: new CellCoordinate('b2')},

    // для шашек
    // {checker: new Checker(true), coordinates: new CellCoordinate('b2')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('c3')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('e5')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('g7')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('g5')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('c5')},
    // {checker: new Checker(false), coordinates: new CellCoordinate('c7')},

    

    {checker: new Checker(true), coordinates: new CellCoordinate('a1')},
    {checker: new Checker(true), coordinates: new CellCoordinate('c1')},
    {checker: new Checker(true), coordinates: new CellCoordinate('e1')},
    {checker: new Checker(true), coordinates: new CellCoordinate('g1')},

    {checker: new Checker(true), coordinates: new CellCoordinate('b2')},
    {checker: new Checker(true), coordinates: new CellCoordinate('d2')},
    {checker: new Checker(true), coordinates: new CellCoordinate('f2')},
    {checker: new Checker(true), coordinates: new CellCoordinate('h2')},

    {checker: new Checker(true), coordinates: new CellCoordinate('a3')},
    {checker: new Checker(true), coordinates: new CellCoordinate('c3')},
    {checker: new Checker(true), coordinates: new CellCoordinate('e3')},
    {checker: new Checker(true), coordinates: new CellCoordinate('g3')},

    {checker: new Checker(false), coordinates: new CellCoordinate('b6')},
    {checker: new Checker(false), coordinates: new CellCoordinate('d6')},
    {checker: new Checker(false), coordinates: new CellCoordinate('f6')},
    {checker: new Checker(false), coordinates: new CellCoordinate('h6')},
    
    {checker: new Checker(false), coordinates: new CellCoordinate('a7')},
    {checker: new Checker(false), coordinates: new CellCoordinate('c7')},
    {checker: new Checker(false), coordinates: new CellCoordinate('e7')},
    {checker: new Checker(false), coordinates: new CellCoordinate('g7')},
    
    {checker: new Checker(false), coordinates: new CellCoordinate('b8')},
    {checker: new Checker(false), coordinates: new CellCoordinate('d8')},
    {checker: new Checker(false), coordinates: new CellCoordinate('f8')},
    {checker: new Checker(false), coordinates: new CellCoordinate('h8')}
  ]
})()