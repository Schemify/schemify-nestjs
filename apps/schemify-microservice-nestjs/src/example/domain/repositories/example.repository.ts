import { ExampleEntity } from '../entities/example.entity'
export interface ExampleRepository {
  save(entity: ExampleEntity): Promise<ExampleEntity>
  findById(id: string): Promise<ExampleEntity | null>
  findAll(): Promise<ExampleEntity[]>
  update(id: string, entity: ExampleEntity): Promise<ExampleEntity>
  delete(id: string): Promise<void>
}
