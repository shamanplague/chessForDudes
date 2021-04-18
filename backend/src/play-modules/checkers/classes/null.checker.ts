import { Checker } from './checker'

export class NullChecker extends Checker {
  constructor () {
    super(true)
  }
  isWhite (): boolean {
    return null
  }
  isNull (): boolean {
    return true
  }
}