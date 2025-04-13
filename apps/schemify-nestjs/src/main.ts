/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { join } from 'path'
import { EXAMPLE } from '@app/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../example.proto'), // Ubicacion del archivo proto en la aplicacion compilada
        package: EXAMPLE as string
      }
    }
  )
  await app.listen()
}
bootstrap()
