/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { ExamplesService } from './examples.service'
import { CreateExampleDto, UpdateExampleDto } from '@app/common'

@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.examplesService.createExample(createExampleDto)
  }

  @Get()
  findAll() {
    return this.examplesService.getAllExamples()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examplesService.getExampleById({ id })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.examplesService.updateExample(updateExampleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examplesService.deleteExample({ id })
  }

  @Get('pagination')
  paginationExample() {
    return this.examplesService.paginationExample()
  }
}
