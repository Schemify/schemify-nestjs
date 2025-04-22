import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'

import { EXAMPLE_PACKAGE_NAME } from 'libs/proto/generated'
import { join } from 'path'

// import { Partitioners } from 'kafkajs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: EXAMPLE_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        '../proto/src/services/example_service/example.proto'
      )
    }
  })

  // 3. Configurar Kafka (para consumir mensajes asíncronos)

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,

  //   options: {
  //     client: {
  //       clientId: 'example-service',
  //       brokers: ['kafka1:9092', 'kafka2:9092']
  //     },

  //     consumer: {
  //       groupId: 'example-consumer'
  //     }
  //   }
  // })

  // 4. Iniciar los microservicios
  await app.startAllMicroservices()
}

bootstrap().catch((err) => {
  console.error('Error al iniciar el microservicio:', err)
  process.exit(1)
})
