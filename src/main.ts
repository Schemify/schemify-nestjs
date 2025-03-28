import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupSwagger(app)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err)
})
