import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KafkaProducerService } from './kafka-producer.service'
import { ExampleCreatedConsumer } from './consumers/example-created.consumer'

import { kafkaCommonConfig } from '../../config/kafka.config'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          ...kafkaCommonConfig,
          consumer: {
            groupId: 'unused-producer-only'
          }
        }
      }
    ])
  ],
  controllers: [ExampleCreatedConsumer],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService]
})
export class KafkaModule {}
