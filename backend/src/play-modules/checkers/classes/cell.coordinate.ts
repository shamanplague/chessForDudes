export class CellCoordinate {
  
  private letter: string
  private number: number
  
  constructor (coordinate: string) {
    if (!/^[a-h][1-8]$/.test(coordinate)) {
      throw `Недопустимый идентификатор клетки: ${coordinate}`
    }
    this.letter = this.getLetterFromCoordinate(coordinate)
    this.number = this.getNumberFromCoordinate(coordinate)
  }

  getLetter (): string {
    return this.letter
  }

  getNumber (): number {
    return this.number
  }

  asString (): string {
    return `${this.getLetter()}${this.getNumber()}`
  }

  private getLetterFromCoordinate (coordinate: string): string {
    return coordinate.match(/[a-h]/)[0]
  }

  private getNumberFromCoordinate (coordinate: string): number {
    return +coordinate.match(/[1-8]/)[0]
  }

}
