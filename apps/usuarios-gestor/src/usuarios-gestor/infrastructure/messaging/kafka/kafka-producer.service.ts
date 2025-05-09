import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

// TODO: Cambiar por tus propias importaciones de proto
import { UsuariosGestor } from '@app/proto'

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect()
  }

  async emitUsuariosGestorCreated(payload: UsuariosGestor) {
    const message = {
      key: payload.id,
      value: JSON.stringify(payload)
    }

    const sizeInBytes = Buffer.byteLength(message.value, 'utf8')

    // * Debugging de tamaño del mensaje
    // console.log(`📦 Tamaño del mensaje Kafka: ${sizeInBytes} bytes`)

    // Validación
    if (sizeInBytes > 1024 * 1024) {
      throw new Error('Payload demasiado grande para Kafka (> 1MB) 🚫')
    }

    // Enviar mensaje a Kafka
    await lastValueFrom(this.client.emit('usuarios-gestor-created', message))
  }
}
