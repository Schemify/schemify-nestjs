// import { NestFactory } from '@nestjs/core'
// import { Transport, MicroserviceOptions } from '@nestjs/microservices'
// import { AppModule } from './app.module'
// import { join } from 'path'
// import { Logger } from '@nestjs/common'
// import { EXAMPLE_PACKAGE_NAME } from '@app/common' // Ajusta según tu paquete protobuf
// // import { Partitioners } from 'kafkajs'

// async function bootstrap() {
//   const logger = new Logger('MicroserviceBootstrap')

//   // =========================================================================
//   // 1. Crear la aplicación NestJS (sin HTTP por defecto)
//   // =========================================================================
//   const app = await NestFactory.create(AppModule, { logger })

//   // =========================================================================
//   // 2. Configurar el servidor gRPC (para llamadas síncronas)
//   // =========================================================================
//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.GRPC,
//     options: {
//       package: EXAMPLE_PACKAGE_NAME, // Nombre del paquete en tu .proto
//       protoPath: join(__dirname, '../example.proto') // Ruta al archivo proto
//     }
//   })

//   // =========================================================================
//   // 3. Configurar Kafka (para consumir mensajes asíncronos)
//   // =========================================================================
//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.KAFKA,

//     options: {
//       client: {
//         clientId: 'example-service',
//         brokers: ['kafka1:9092', 'kafka2:9092']
//       },

//       consumer: {
//         groupId: 'example-consumer'
//       }
//     }
//   })

//   // =========================================================================
//   // 4. Iniciar los microservicios
//   // =========================================================================
//   await app.startAllMicroservices()

//   logger.log(
//     `✅ Microservicio iniciado:
//     - gRPC escuchando en 0.0.0.0:50051
//     - Kafka consumiendo de los brokers: kafka1:9092, kafka2:9092`
//   )
// }

// // =============================================================================
// // 5. Lanzar la aplicación
// // =============================================================================
// bootstrap().catch((err) => {
//   console.error('Error al iniciar el microservicio:', err)
//   process.exit(1)
// })
