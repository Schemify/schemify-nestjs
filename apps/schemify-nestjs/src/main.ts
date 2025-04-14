import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { join } from 'path'
import { Logger } from '@nestjs/common'
import { EXAMPLE } from '@app/common' // Ajusta según tu paquete protobuf
// import { Partitioners } from 'kafkajs'

async function bootstrap() {
  const logger = new Logger('MicroserviceBootstrap')

  // =========================================================================
  // 1. Crear la aplicación NestJS (sin HTTP por defecto)
  // =========================================================================
  const app = await NestFactory.create(AppModule, { logger })

  // =========================================================================
  // 2. Configurar el servidor gRPC (para llamadas síncronas)
  // =========================================================================
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: EXAMPLE, // Nombre del paquete en tu .proto
      protoPath: join(__dirname, '../proto/example.proto'), // Ruta al archivo proto
      url: '0.0.0.0:50051', // Puerto gRPC (ajusta según tu necesidad)
      loader: {
        keepCase: true, // Mantener nombres de campos en camelCase
        longs: String // Tratar campos 'int64' como strings (evita overflow)
      }
    }
  })

  // =========================================================================
  // 3. Configurar Kafka (para consumir mensajes asíncronos)
  // =========================================================================
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,

  //   options: {
  //     client: {
  //       brokers: ['kafka1:9092', 'kafka2:9092'],
  //       clientId: 'example-schemify-nestjs'
  //     },
  //     producer: {
  //       createPartitioner: Partitioners.LegacyPartitioner,
  //       allowAutoTopicCreation: true
  //     },
  //     consumer: {
  //       groupId: 'example-group'
  //     }
  //   }
  // })
  // =========================================================================
  // 4. Iniciar los microservicios
  // =========================================================================
  await app.startAllMicroservices()

  logger.log(
    `✅ Microservicio iniciado:
    - gRPC escuchando en 0.0.0.0:50051
    - Kafka consumiendo de los brokers: kafka1:9092, kafka2:9092`
  )
}

// =============================================================================
// 5. Lanzar la aplicación
// =============================================================================
bootstrap().catch((err) => {
  console.error('Error al iniciar el microservicio:', err)
  process.exit(1)
})
