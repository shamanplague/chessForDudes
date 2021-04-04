import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHelloVasya(): string {
    return 'Hello Vasya!';
  }
}
