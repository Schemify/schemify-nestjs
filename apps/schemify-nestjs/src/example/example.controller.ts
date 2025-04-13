/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
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

@Controller()
@ExampleServiceControllerMethods()
export class ExampleController implements ExampleServiceController {
  constructor(private readonly exampleService: ExampleService) {}

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
