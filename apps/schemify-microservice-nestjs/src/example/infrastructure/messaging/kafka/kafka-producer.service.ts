import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

import { Example } from '@app/proto'
import { ExampleCreatedEvent } from '../../../domain/events/example-created.event'
import { DescriptionValueObject } from '../../../domain/value-objects/description.value-object'

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect()
  }

  async emitExampleCreated(payload: Example) {
    const event = new ExampleCreatedEvent({
      id: payload.id,
      name: payload.name,
      description: new DescriptionValueObject(payload.description),
      occurredAt: new Date()
    })

    const message = {
      key: event.id.toString(),
      value: JSON.stringify(event)
    }

    const sizeInBytes = Buffer.byteLength(message.value, 'utf8')

    if (sizeInBytes > 1024 * 1024) {
      throw new Error('❌ Payload demasiado grande para Kafka (> 1MB)')
    }

    await lastValueFrom(this.client.emit('example-created', message))
  }
}
