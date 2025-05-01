/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Injectable()
export class ExampleCreatedConsumer {
  @MessagePattern('example.created')
  handleExampleCreated(@Payload() message: any) {
    const data = JSON.parse(message.value.toString())
    console.log('📥 Evento recibido:', data)
  }
}
