import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { JwtGuard } from './websockets/guards/ws-jwt.guard'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  await app.listen(3000)
}
bootstrap();
