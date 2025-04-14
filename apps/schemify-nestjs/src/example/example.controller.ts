/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */

import { Controller } from '@nestjs/common'

import { ExampleService } from './example.service'

import {
  ExampleServiceController,
  GetExampleByIdDto,
  PaginationDto,
  CreateExampleDto,
  UpdateExampleDto,
  ExampleServiceControllerMethods
} from '@app/common'
import { Observable } from 'rxjs'
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices'

@Controller()
@ExampleServiceControllerMethods()
export class ExampleController implements ExampleServiceController {
  constructor(private readonly exampleService: ExampleService) {}

  @EventPattern('example.created')
  // eslint-disable-next-line @typescript-eslint/require-await
  async handleExampleCreated(@Payload() example, @Ctx() context: KafkaContext) {
    console.log('Example created:', example)

    const originalKafkaMessage = context.getMessage()

    console.log('Original Kafka message:', originalKafkaMessage)

    console.log(`key: ${originalKafkaMessage.key}`)
    console.log(`value: ${originalKafkaMessage.value}`)
    console.log(`headers: ${originalKafkaMessage.timestamp}`)
    console.log(`offset: ${originalKafkaMessage.offset}`)
    console.log(`headers: ${originalKafkaMessage.headers}`)
  }

  async geExampleTime() {
    return this.exampleService.getExampleTime()
  }

  createExample(createExampleDto: CreateExampleDto) {
    return this.exampleService.createExample(createExampleDto)
  }

  getAllExamples() {
    return this.exampleService.getAllExamples()
  }

  getExampleById(getExampleByIdDto: GetExampleByIdDto) {
    return this.exampleService.getExampleById(getExampleByIdDto.id)
  }

  updateExample(updateExampleDto: UpdateExampleDto) {
    return this.exampleService.updateExample(
      updateExampleDto.id,
      updateExampleDto
    )
  }

  deleteExample(getExampleByIdDto: GetExampleByIdDto) {
    return this.exampleService.deleteExample(getExampleByIdDto.id)
  }

  queryExamples(paginationDtoStream: Observable<PaginationDto>) {
    return this.exampleService.queryExamples(paginationDtoStream)
  }
}
