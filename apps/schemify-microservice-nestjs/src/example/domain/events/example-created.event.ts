import { ExampleEntity } from '../entities/example.entity'

export class ExampleCreatedEvent {
  public readonly occurredAt: Date
  public readonly example: ExampleEntity

  constructor(example: ExampleEntity) {
    this.occurredAt = new Date()
    this.example = example
  }
}
