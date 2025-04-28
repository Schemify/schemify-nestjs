import { NestFactory } from '@nestjs/core'
import { MicroserviceExampleModule } from './microservice-example.module'

async function bootstrap() {
  const app = await NestFactory.create(MicroserviceExampleModule)
  await app.listen(process.env.port ?? 3004)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
