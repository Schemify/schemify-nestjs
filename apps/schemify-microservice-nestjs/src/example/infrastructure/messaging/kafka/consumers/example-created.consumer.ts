/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Example } from '@app/proto'

@Controller()
export class ExampleCreatedConsumer {
  @MessagePattern('example-created')
  handleExampleCreated(@Payload() message: Example) {
    try {
      console.log('📥 Evento recibido desde Kafka:')
      console.log('📝 Mensaje tipado:', message)

      const sizeInBytes = Buffer.byteLength(JSON.stringify(message), 'utf8')
      console.log(`📦 Tamaño estimado: ${sizeInBytes} bytes`)

      // 🔄 Aquí podrías disparar un caso de uso:
      // this.exampleUseCase.handle(data)
    } catch (error) {
      console.error('❌ Error al procesar mensaje Kafka:', error)
    }
  }
}
