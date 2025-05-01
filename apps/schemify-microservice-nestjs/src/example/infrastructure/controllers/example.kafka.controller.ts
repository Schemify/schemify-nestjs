// import { Controller } from '@nestjs/common'
// import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices'

// @Controller()
// export class ExampleKafkaController {
//   @EventPattern('example.created')
//   async handleExampleCreated(
//     @Payload() example: any,
//     @Ctx() context: KafkaContext
//   ) {
//     // Implementación del handler de eventos
//     const originalMessage = context.getMessage()
//     console.log('Received Kafka message:', {
//       key: originalMessage.key?.toString(),
//       value: example,
//       headers: originalMessage.headers,
//       timestamp: originalMessage.timestamp
//     })
//     // Lógica de procesamiento del evento
//   }
// }
