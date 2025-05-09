import { DescriptionValueObject } from '../value-objects/description.value-object'

export class ExampleCreatedEvent {
  public readonly occurredAt: Date
  public readonly id: string
  public readonly name: string
  public readonly description: DescriptionValueObject | null

  constructor(example: ExampleCreatedEvent) {
    this.occurredAt = new Date()
    this.id = example.id
    this.name = example.name
    this.description = example.description ?? null
  }
}
