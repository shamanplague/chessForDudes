import { User } from "src/users/user";

export class CheckersPlayer extends User{
  
  private _isCheckersColorWhite: boolean
  
  constructor (user: User, isWhite: boolean) {
    super(user.getId(), user.getUsername(), user.getPassword(), user.getToken(), user.getSocketId(), user.isAnonymous())
    this._isCheckersColorWhite = isWhite
  }
  isCheckersColorWhite () {
    return this._isCheckersColorWhite
  }
  
}
