export class Checker {
  private _isKing: boolean = false
  
  constructor (
    private _isWhite: boolean
  ) {}

  isKing (): boolean {
    return this._isKing
  }
  makeKing (): void {
    this._isKing = true
  }
  isWhite () :boolean {
    return this._isWhite
  }
  setColor (isWhite: boolean): void {
    this._isWhite = isWhite
  }
  isNull (): boolean {
    return false
  }
}