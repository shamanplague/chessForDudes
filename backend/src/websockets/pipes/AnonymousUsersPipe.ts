import { Injectable, PipeTransform } from '@nestjs/common'
import { MessageBody } from '@nestjs/websockets'
import { UsersService } from '../../users/users.service'

@Injectable()
export class AnonymousUsersPipe implements PipeTransform {
    
    constructor(
        private usersService: UsersService
    ) {}

    async transform(@MessageBody() messageBody) {
        let userForReturn = messageBody

        if (messageBody.isAnonymous) {
            userForReturn = await this.usersService.addAnonymousUser()
        }

        return userForReturn
    }
}