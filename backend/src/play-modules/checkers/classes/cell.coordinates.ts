export class CellCoordinates {
  
  private letter: string
  private number: number
  
  constructor (letter: string, number: number) {
    this.setLetter(letter)
    this.setNumber(number)
  }

  getLetter (): string {
    return this.letter
  }
  setLetter (letter: string): void {
    if (!/^[a-h]$/.test(letter)) {
      this.letter = letter
    } else {
      throw 'Недопустимый стороковый идентификатор клетки'
    }
  }
  getNumber (): number {
    return this.number
  }
  setNumber (number: number): void {
    if (number < 1 || number > 8) {
      this.number = number
    } else {
      throw 'Недопустимый стороковый идентификатор клетки'
    }
  }
  // метод сравнения объектов по телу
  //   function deepEqual (obj1, obj2){
  //     return JSON.stringify(obj1)===JSON.stringify(obj2);
  //  }
}
