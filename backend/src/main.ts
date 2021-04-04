import { NestFactory } from '@nestjs/core'
import { GatewayModule } from './websockets/socket.module'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { cors: true })
  await app.listen(3000)
}
bootstrap();
