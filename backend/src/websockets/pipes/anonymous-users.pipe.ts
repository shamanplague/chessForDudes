import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { MessageBody } from '@nestjs/websockets'
import { UsersService } from '../../users/users.service'

@Injectable()
export class AnonymousUsersPipe implements PipeTransform {
    
    constructor(
        private usersService: UsersService
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        let userForReturn = value

        console.log('На пайпе', value)

        if (value.isAnonymous) {
            userForReturn = await this.usersService.addAnonymousUser()
        }

        return userForReturn
    }
}