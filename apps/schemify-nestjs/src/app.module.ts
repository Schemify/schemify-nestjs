import { Module } from '@nestjs/common'
import { ExampleModule } from './example/example.module'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXAMPLE_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka1:9092', 'kafka2:9092'],
            clientId: 'example-schemify-nestjs'
          },
          producer: {
            allowAutoTopicCreation: true
          },
          producerOnlyMode: true
        }
      }
    ]),
    ExampleModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
