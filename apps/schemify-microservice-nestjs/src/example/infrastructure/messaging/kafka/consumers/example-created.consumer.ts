/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import { Controller, Inject } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ExampleCreatedEvent } from '../../../../domain/events/example-created.event'
import { ExampleCreatedUseCase } from '../../../../application/use-cases/create-example.use-case'

@Controller()
export class ExampleCreatedConsumer {
  constructor(
    @Inject(ExampleCreatedUseCase)
    private readonly exampleUseCase: ExampleCreatedUseCase
  ) {}

  @MessagePattern('example-created')
  handleExampleCreated(@Payload() message: ExampleCreatedEvent) {
    try {
      this.exampleUseCase.processEvent(message)
    } catch (error) {
      console.error('❌ Error al procesar mensaje Kafka:', error)
    }
  }
}
