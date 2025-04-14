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
import { EventPattern, Payload } from '@nestjs/microservices'

@Controller()
@ExampleServiceControllerMethods()
export class ExampleController implements ExampleServiceController {
  constructor(private readonly exampleService: ExampleService) {}

  @EventPattern('example.created')
  // eslint-disable-next-line @typescript-eslint/require-await
  async handleExampleCreated(@Payload() example) {
    console.log('Example created:', example)
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
