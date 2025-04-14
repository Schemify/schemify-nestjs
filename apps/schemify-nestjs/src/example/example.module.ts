import { Module } from '@nestjs/common'
import { ExampleService } from './example.service'
import { ExampleController } from './example.controller'
// import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  // imports: [
  //   ClientsModule.register([
  //     {
  //       name: 'EXAMPLE_KAFKA_CLIENT',
  //       transport: Transport.KAFKA,
  //       options: {
  //         client: {
  //           brokers: ['kafka1:9092', 'kafka2:9092'],
  //           clientId: 'example-schemify-nestjs'
  //         },
  //         producer: {
  //           allowAutoTopicCreation: true
  //         },
  //         consumer: {
  //           groupId: 'example-consumer'
  //         }
  //       }
  //     }
  //   ])
  // ],
  controllers: [ExampleController],
  providers: [ExampleService]
})
export class ExampleModule {}
