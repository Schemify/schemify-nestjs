import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateExampleDto } from '../dtos/create-example.dto'
import { ExampleEntity } from '../../domain/entities/example.entity'
import { ExampleRepository } from '../../domain/repositories/example.repository'

@Injectable()
export class ExampleApplicationService {
  constructor(
    @Inject('ExampleRepository') private readonly repository: ExampleRepository
  ) {}

  async create(dto: CreateExampleDto): Promise<ExampleEntity> {
    const example = ExampleEntity.create(dto)
    return this.repository.save(example)
  }

  async findOne(id: string): Promise<ExampleEntity> {
    const entity = await this.repository.findById(id)

    if (!entity) {
      throw new NotFoundException(`Example with id ${id} not found`)
    }

    return entity
  }

  async findAll(): Promise<ExampleEntity[]> {
    return this.repository.findAll()
  }

  async update(
    id: string,
    dto: Partial<CreateExampleDto>
  ): Promise<ExampleEntity> {
    const entity = await this.findOne(id)
    entity.update(dto)
    return this.repository.save(entity)
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id)

    try {
      if (!entity) {
        throw new NotFoundException(`Example with id ${id} not found`)
      }
      await this.repository.delete(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Error deleting example with id ${id}: ${error.message}`)
    }
  }
}
